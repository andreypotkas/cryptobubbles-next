import "./Loader.scss";

export default function Loader() {
  return (
    <div className="loading-spinner" data-testid="loading-spinner">
      <div className="loading-spinner-content">
        <h3 className="text-4xl">Please wait</h3>
        <p>It can take some time to first load..</p>
        <div className="w-full flex justify-center items-center mt-8">
          <span data-testid="loader" className="loader"></span>{" "}
        </div>
      </div>
    </div>
  );
}
