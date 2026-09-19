import { Link } from 'react-router-dom';
import PageTitle from '../molecules/PageTitle.jsx';

export default function NotFoundPage() {
  return (
    <>
      <PageTitle eyebrow="404" title="Nothing here." />
      <Link to="/" style={{ color: 'var(--color-primary)', fontWeight: 500, textUnderlineOffset: 4 }}>
        Back to Today
      </Link>
    </>
  );
}
