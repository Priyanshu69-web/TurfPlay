import cron from 'node-cron';
import BookingModel from '../models/bookingModel.js';
import UserModel from '../models/userModel.js';
import TurfModel from '../models/turfModel.js';
import { sendBookingReminderEmail } from '../utils/emailService.js';

export const startReminderCronJob = () => {
  // Run every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    try {
      console.log('Running reminder cron job...');
      const now = new Date();
      const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      // Find bookings that are confirmed, not yet reminded, and start within the next 2 hours today
      const upcomingBookings = await BookingModel.find({
        status: 'confirmed',
        reminderSent: false,
        date: {
          $gte: new Date(now.setHours(0, 0, 0, 0)),
          $lte: new Date(now.setHours(23, 59, 59, 999))
        }
      });

      for (const booking of upcomingBookings) {
        // Parse the start time (e.g., "14:00" or "02:00 PM")
        // For simplicity, assuming 24h format "HH:mm" from slot generation or standardizing it
        let bookingTime = new Date(booking.date);
        
        const timeMatch = booking.startTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (timeMatch) {
            let hours = parseInt(timeMatch[1], 10);
            const minutes = parseInt(timeMatch[2], 10);
            const ampm = timeMatch[3];
            
            if (ampm && ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
            if (ampm && ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
            
            bookingTime.setHours(hours, minutes, 0, 0);

            const timeDiffMs = bookingTime.getTime() - new Date().getTime();
            const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

            // If the booking is within the next 2 hours and hasn't passed
            if (timeDiffHours > 0 && timeDiffHours <= 2) {
                const user = await UserModel.findById(booking.userId);
                const turf = await TurfModel.findById(booking.turfId);
                
                if (user && turf) {
                    await sendBookingReminderEmail(user.email, {
                        turfName: turf.name,
                        date: booking.date.toDateString(),
                        startTime: booking.startTime,
                        endTime: booking.endTime
                    });

                    // Mark reminder as sent
                    booking.reminderSent = true;
                    await booking.save();
                    console.log(`Reminder sent for booking ${booking._id}`);
                }
            }
        }
      }
    } catch (error) {
      console.error('Error running reminder cron job:', error);
    }
  });
  console.log('Reminder cron job scheduled.');
};
