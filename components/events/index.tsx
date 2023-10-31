import EventsProps from '@interfaces/events/Events';
// import dynamic from 'next/dynamic';
import MaxWidth from '@components/layout/MaxWidth';
import Image from 'next/image';
import OtherEvents from './OtherEvents';
import { Event } from '@data/interface/eventsData';
import FeaturedEvent from './FeaturedEvent';
// import Landing from './Landing';

// need to disable SSR for this component cos we are using date object generated at client side
// const CalendarComp = dynamic(() => import('@components/events/CalendarComp'), {
//   ssr: false,
// });

const Events = ({ events }: EventsProps) => {
  const sortedEvents = events.sort(
    (a: Event, b: Event) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const featuredEvent = sortedEvents[0];
  return (
    <>
      <MaxWidth>
        <div className="mt-3 flex flex-wrap text-[24.48px]">
          <div className="relative h-[52px] w-[58px] sm:mt-6 sm:h-[100px] sm:w-[112px]">
            <Image
              src="/images/events/Events-logo.jpg"
              alt="Recruitment Logo"
              layout="fill"
            />
          </div>
          <h1 className="ml-4 mt-3 border-b-2 border-[#002750] font-bold leading-8 text-[#002750] sm:ml-6 sm:mt-10 sm:border-b-4 sm:text-6xl sm:leading-[4.538rem]">
            Events
          </h1>
        </div>
        <FeaturedEvent event={featuredEvent} />

        <OtherEvents />
      </MaxWidth>
    </>
  );
};

export default Events;
