'use client';

import { useActiveLiveStream, usePreviousLiveStreams } from '../../requests/livestreams';
import LiveStreamCard from '../../components/livestreams/LiveStreamCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ArrowPathIcon, NoSymbolIcon } from '@heroicons/react/24/outline';

export default function LivePage() {
  const {
    activeLiveStream,
    isLoading: isLoadingActive,
    mutate: refreshActive
  } = useActiveLiveStream();
  const {
    previousLiveStreams,
    isLoading: isLoadingPrevious,
    mutate: refreshPrevious
  } = usePreviousLiveStreams();

  return (
    <div className="mx-auto px-2 py-8 lg:px-6">
      {/* Active Live Stream Section */}
      <section className="mb-16">
        {activeLiveStream === null && isLoadingActive ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : activeLiveStream ? (
          <LiveStreamCard livestream={activeLiveStream} isActive={true} />
        ) : (
          <div className="card bg-base-200 text-center">
            <div className="card-body items-center py-12">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-base-300">
                <NoSymbolIcon className="h-8 w-8 text-base-content opacity-70" />
              </div>
              <h3 className="card-title mb-2">No Active Stream</h3>
              <p className="text-base-content opacity-70">
                There are no active live streams at the moment. Check back later!
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Previous Live Streams Section */}
      <section>
        <div className="divider divider-start mb-8 text-2xl font-semibold">Previous Streams</div>

        {isLoadingPrevious ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : previousLiveStreams && previousLiveStreams.length > 0 ? (
          <div className="space-y-6">
            {previousLiveStreams.map((livestream) => (
              <LiveStreamCard key={livestream.uuid} livestream={livestream} />
            ))}
          </div>
        ) : (
          <div className="card bg-base-200 text-center">
            <div className="card-body items-center py-12">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-base-300">
                <NoSymbolIcon className="h-8 w-8 text-base-content opacity-70" />
              </div>
              <h3 className="card-title mb-2">No Previous Streams</h3>
              <p className="text-base-content opacity-70">
                There are no previous live streams to display.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
