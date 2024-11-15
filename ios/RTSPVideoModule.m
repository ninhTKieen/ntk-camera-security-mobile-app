// RCTCalendarModule.m
#import "RTSPVideoModule.h"
#import <AVFoundation/AVFoundation.h>
#import <React/RCTUIManager.h>

@implementation RTSPVideoModule

RCT_EXPORT_MODULE(RTSPVideoView)

- (UIView *)view
{
    UIView *view = [[UIView alloc] init];
    self.player = [AVPlayer new];
    self.playerLayer = [AVPlayerLayer playerLayerWithPlayer:self.player];
    self.playerLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;
    [view.layer addSublayer:self.playerLayer];
    
    // Add layout callback to update player layer frame
    view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    [view addObserver:self forKeyPath:@"bounds" options:NSKeyValueObservingOptionNew context:nil];
    
    return view;
}

// Add observer method to handle frame updates
- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context {
    if ([keyPath isEqualToString:@"bounds"]) {
        self.playerLayer.frame = [(UIView *)object bounds];
    } else if ([keyPath isEqualToString:@"status"]) {
        AVPlayerItem *playerItem = (AVPlayerItem *)object;
        if (playerItem.status == AVPlayerItemStatusFailed) {
            NSLog(@"Player item failed with error: %@", playerItem.error);
        } else if (playerItem.status == AVPlayerItemStatusReadyToPlay) {
            NSLog(@"Player item is ready to play");
        }
    }
}

RCT_CUSTOM_VIEW_PROPERTY(paused, BOOL, UIView) {
    if (json) {
        BOOL paused = [RCTConvert BOOL:json];
        if (paused) {
            [self.player pause];
        } else {
            [self.player play];
        }
    }
}

RCT_EXPORT_METHOD(playVideo:(NSString *)urlString
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSLog(@"Playing video with URL: %@", urlString);
    NSURL *url = [NSURL URLWithString:urlString];
    AVPlayerItem *playerItem = [AVPlayerItem playerItemWithURL:url];
    
    [self.player replaceCurrentItemWithPlayerItem:playerItem];
    [self.player play];
    
    // Add observer for player item status
    [playerItem addObserver:self forKeyPath:@"status" options:NSKeyValueObservingOptionNew context:nil];
    
    resolve(@YES);
}

RCT_EXPORT_METHOD(pause:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.player pause];
    resolve(@YES);
}

RCT_EXPORT_METHOD(resume:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.player play];
    resolve(@YES);
}

@end
