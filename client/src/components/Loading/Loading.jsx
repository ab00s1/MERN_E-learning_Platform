import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <div className="loading-book">
          <div className="book-cover" />
          <div className="book-pages" />
        </div>
        <div className="loading-text">Loading Learnera...</div>
      </div>
    </div>
  );
}

export default Loading
