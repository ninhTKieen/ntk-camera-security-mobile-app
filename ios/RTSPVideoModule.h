#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
#import <AVFoundation/AVFoundation.h>

@interface RTSPVideoModule : RCTViewManager <RCTBridgeModule>
@property (nonatomic, strong) AVPlayer *player;
@property (nonatomic, strong) AVPlayerLayer *playerLayer;
- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context;
@end
