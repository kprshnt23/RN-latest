import BackgroundJob from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import { Platform } from 'react-native';

const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(resolve, time));

BackgroundJob.on('expiration', () => {
  console.log('iOS: I am being closed!');
});

const taskRandom = async (taskData: any) => {
  console.log('hellooooo anjum babyyyyy');
  const { delay } = taskData;

  // Define a function to get the current position
  const getCurrentPosition = () => new Promise<void>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('Position:', position);
        resolve();
      },
      (error) => {
        console.log('Geolocation error:', error.code, error.message);
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });

  await new Promise<void>((resolve) => {
    const intervalId = setInterval(async () => {
      if (!BackgroundJob.isRunning()) {
        clearInterval(intervalId); // Stop the interval if the background job is no longer running
        resolve();
        return;
      }

      try {
        await getCurrentPosition();
        await BackgroundJob.updateNotification({ taskDesc: 'Getting position...' });
      } catch (error) {
        console.log('Error getting position:', error);
      }
    }, 5000); // Get position every 5 seconds
  });
};

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask desc',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'exampleScheme://chat/jane',
  parameters: {
    delay: 1000,
  },
};

// Function to start the background job
export const startBackgroundJob = async () => {
  try {
    console.log('Trying to start background service');
    await BackgroundJob.start(taskRandom, options);
    console.log('Background service started successfully!');
  } catch (e) {
    console.log('Error starting background service:', e);
  }
};

// Function to stop the background job
export const stopBackgroundJob = async () => {
  try {
    console.log('Stopping background service');
    await BackgroundJob.stop();
    console.log('Background service stopped successfully!');
  } catch (e) {
    console.log('Error stopping background service:', e);
  }
};
