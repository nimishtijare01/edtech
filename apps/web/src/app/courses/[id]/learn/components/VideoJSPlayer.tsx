"use client";

import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { markLessonProgress } from "../actions";

interface VideoJSPlayerProps {
  options: any;
  lessonId: string;
  courseId: string;
  initialTime?: number;
  onReady?: (player: any) => void;
}

export function VideoJSPlayer({ options, lessonId, courseId, initialTime = 0, onReady }: VideoJSPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const lastSyncTime = useRef<number>(0);
  const isSeekingToInitial = useRef<boolean>(true);

  const syncProgress = async (player: any, forceComplete = false) => {
    const currentTime = player.currentTime();
    const duration = player.duration();
    if (!duration) return;

    const watchedPercentage = Math.min(100, Math.round((currentTime / duration) * 100));
    const isCompleted = forceComplete || watchedPercentage >= 95;

    try {
      await markLessonProgress(lessonId, courseId, isCompleted, currentTime, watchedPercentage);
      console.log(`Synced progress: ${currentTime}s (${watchedPercentage}%)`);
    } catch (e) {
      console.error("Failed to sync progress:", e);
    }
  };

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-big-play-centered');
      videoElement.classList.add('w-full');
      videoElement.classList.add('h-full');
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready');

        // Resume from where left off
        if (initialTime > 0 && isSeekingToInitial.current) {
          player.currentTime(initialTime);
          isSeekingToInitial.current = false;
        }

        onReady && onReady(player);
      });

      // --- Progress Tracking Logic ---
      
      // 1. Listen to timeupdate (Ping every 15s)
      player.on('timeupdate', () => {
        const now = Date.now();
        // Sync every 15 seconds
        if (now - lastSyncTime.current > 15000) {
          lastSyncTime.current = now;
          syncProgress(player);
        }
      });

      // 2. Listen to pause event
      player.on('pause', () => {
        // Sync immediately on pause
        lastSyncTime.current = Date.now();
        syncProgress(player);
      });

      // 3. Listen to end event
      player.on('ended', () => {
        syncProgress(player, true); // Mark as 100% complete
      });

    } else if (playerRef.current) {
      // If the lesson changes, update the source
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
      isSeekingToInitial.current = true;
      lastSyncTime.current = Date.now(); // reset sync timer
      
      // We need to wait for metadata to load before seeking
      player.one('loadedmetadata', () => {
        if (initialTime > 0 && isSeekingToInitial.current) {
          player.currentTime(initialTime);
          isSeekingToInitial.current = false;
        }
      });
    }
  }, [options, videoRef, lessonId]);

  // Dispose the player when the component unmounts
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player className="w-full h-full bg-black">
      <div ref={videoRef} className="w-full h-full" />
    </div>
  );
}
