import { Link, useNavigate, useParams } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchEvent, queryClient, updateEvent } from '../../utils/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {
  const navigate = useNavigate();
  const params = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['events', { id: params.id }],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });

  /**
   * UPDATE DATA IN CACHE: https://tanstack.com/query/v4/docs/react/guides/optimistic-updates
   *
   * queryClient.cancelQueries =>
   * https://tanstack.com/query/v4/docs/react/reference/QueryClient#queryclientcancelqueries
   *
   * queryClient.setQueryData =>
   * https://tanstack.com/query/v4/docs/react/reference/QueryClient#queryclientsetquerydata
   *
   * queryClient.getQueryData =>
   * https://tanstack.com/query/v4/docs/react/reference/QueryClient#queryclientgetquerydata
   */

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data) => {
      const newEvent = data.event;

      await queryClient.cancelQueries({
        queryKey: ['events', { id: params.id }],
      });

      const previousEvent = queryClient.getQueryData([
        'events',
        { id: params.id },
      ]);
      queryClient.setQueryData(['events', { id: params.id }], newEvent);

      return { previousEvent }; // {previousEvent: previousEvent}
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(
        ['events', { id: params.id }],
        context.previousEvent
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(['events', { id: params.id }]);
    },
  });

  function handleSubmit(formData) {
    mutate({ id: params.id, event: formData });
    navigate('../');
  }

  function handleClose() {
    navigate('../');
  }

  let content;

  if (isPending) {
    content = (
      <div className="center">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="Failed to load event"
          message={
            error.info?.message ||
            'Failed to load event. Please check your inputs and try again later'
          }
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </>
    );
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    );
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}
