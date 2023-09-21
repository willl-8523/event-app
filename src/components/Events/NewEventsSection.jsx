import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../../utils/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import EventItem from './EventItem.jsx';

export default function NewEventsSection() {
  /**
   * staleTime: 5000 => If I go to another page 5s before and come back
   * It doesn't return the request
   *
   * gcTime: 30000 => The data will be stored in the cache for 30s,
   * after which it will be deleted automatically.
   *
   * In DevTool, in the "No Throttling" tab, select "slow 3g" 
   * to see the difference.
   */
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    staleTime: 5000,
  });

  console.log(data, isPending, isError, error);

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || 'Failed to fetch events.'}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
