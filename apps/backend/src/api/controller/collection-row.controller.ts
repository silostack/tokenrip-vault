import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { Auth, ReqAuth } from '../auth/auth.decorator';
import { RequestAuth } from '../auth/auth.guard';
import { AssetService } from '../service/asset.service';
import { CollectionRowService } from '../service/collection-row.service';
import { Asset, AssetType } from '../../db/models/Asset';
import { parseCapSub } from '../auth/crypto';

@Controller('v0/assets')
export class CollectionRowController {
  constructor(
    private readonly assetService: AssetService,
    private readonly collectionRowService: CollectionRowService,
  ) {}

  @Public()
  @Get(':publicId/rows')
  async getRows(
    @Param('publicId') publicId: string,
    @Query('limit') limit?: string,
    @Query('after') after?: string,
  ) {
    const asset = await this.findCollectionAsset(publicId);
    const result = await this.collectionRowService.getRows(asset.id, {
      limit: limit ? parseInt(limit, 10) : undefined,
      after,
    });
    return {
      ok: true,
      data: {
        rows: result.rows.map((r) => ({
          id: r.id,
          data: r.data,
          createdBy: r.createdBy,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        })),
        nextCursor: result.nextCursor,
      },
    };
  }

  @Post(':publicId/rows')
  @Auth('agent', 'token')
  async appendRows(
    @Param('publicId') publicId: string,
    @Body() body: { rows?: Array<Record<string, unknown>> },
    @ReqAuth() auth: RequestAuth,
  ) {
    if (!body?.rows || !Array.isArray(body.rows) || !body.rows.length) {
      throw new BadRequestException({ ok: false, error: 'MISSING_FIELD', message: 'rows array is required' });
    }

    const asset = await this.findCollectionAsset(publicId);
    this.verifyAccess(asset, auth, 'rows:append');

    const createdBy = auth.agent?.id ?? auth.user?.id ?? 'unknown';
    const created = await this.collectionRowService.appendRows(
      asset,
      body.rows.map((data) => ({ data })),
      createdBy,
    );

    return {
      ok: true,
      data: created.map((r) => ({ id: r.id, createdAt: r.createdAt })),
    };
  }

  @Put(':publicId/rows/:rowId')
  @Auth('agent', 'token')
  async updateRow(
    @Param('publicId') publicId: string,
    @Param('rowId') rowId: string,
    @Body() body: { data?: Record<string, unknown> },
    @ReqAuth() auth: RequestAuth,
  ) {
    if (!body?.data || typeof body.data !== 'object') {
      throw new BadRequestException({ ok: false, error: 'MISSING_FIELD', message: 'data object is required' });
    }

    const asset = await this.findCollectionAsset(publicId);
    this.verifyAccess(asset, auth, 'rows:update');

    const row = await this.collectionRowService.updateRow(asset.id, rowId, body.data);
    return {
      ok: true,
      data: {
        id: row.id,
        data: row.data,
        updatedAt: row.updatedAt,
      },
    };
  }

  @Delete(':publicId/rows')
  @Auth('agent', 'token')
  @HttpCode(204)
  async deleteRows(
    @Param('publicId') publicId: string,
    @Body() body: { row_ids?: string[] },
    @ReqAuth() auth: RequestAuth,
  ) {
    if (!body?.row_ids || !Array.isArray(body.row_ids) || !body.row_ids.length) {
      throw new BadRequestException({ ok: false, error: 'MISSING_FIELD', message: 'row_ids array is required' });
    }

    const asset = await this.findCollectionAsset(publicId);
    this.verifyAccess(asset, auth, 'rows:delete');

    await this.collectionRowService.deleteRows(asset.id, body.row_ids);
  }

  private async findCollectionAsset(publicId: string): Promise<Asset> {
    const asset = await this.assetService.findByPublicId(publicId);
    if (asset.type !== AssetType.COLLECTION) {
      throw new BadRequestException({
        ok: false,
        error: 'NOT_COLLECTION',
        message: 'This asset is not a collection',
      });
    }
    return asset;
  }

  private verifyAccess(asset: Asset, auth: RequestAuth, requiredPerm?: string): void {
    if (auth.capability) {
      const cap = parseCapSub(auth.capability.sub);
      if (!cap || cap.type !== 'asset' || cap.id !== asset.publicId) {
        throw new ForbiddenException({ ok: false, error: 'TOKEN_MISMATCH', message: 'Capability token does not match this asset' });
      }
      if (auth.capability.iss !== asset.ownerId) {
        throw new ForbiddenException({ ok: false, error: 'INVALID_ISSUER', message: 'Capability token was not issued by the asset owner' });
      }
      if (requiredPerm && !auth.capability.perm.includes(requiredPerm)) {
        throw new ForbiddenException({ ok: false, error: 'INSUFFICIENT_PERMISSION', message: `Token does not grant '${requiredPerm}' permission` });
      }
      return;
    }
    if (auth.agent && auth.agent.id === asset.ownerId) return;
    if (auth.user) return; // operators can manage rows
    throw new ForbiddenException({ ok: false, error: 'ACCESS_DENIED', message: 'Access denied' });
  }
}
