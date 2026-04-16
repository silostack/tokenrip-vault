import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mixpanel from 'mixpanel';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly mp: Mixpanel.Mixpanel | null;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('MIXPANEL_TOKEN');
    if (token) {
      this.mp = Mixpanel.init(token, { geolocate: false });
      this.logger.log('Mixpanel analytics initialized');
    } else {
      this.mp = null;
      this.logger.warn('MIXPANEL_TOKEN not set — analytics disabled');
    }
  }

  track(event: string, properties: Record<string, unknown>): void {
    if (!this.mp) return;
    try {
      this.mp.track(event, properties, (err) => {
        if (err) this.logger.warn(`Mixpanel track error: ${err.message}`);
      });
    } catch (err: any) {
      this.logger.warn(`Mixpanel track exception: ${err.message}`);
    }
  }
}
