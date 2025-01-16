function ConnectionError() {
  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="text-center rounded bg-game-accent-medium text-game-main-light p-3 animate-bounce">
        <h1>The connection to the server is faulty.</h1>

        <div className="flex justify-center items-center gap-1 mt-1">
          <h1> Please wait</h1>
          <span className="w-8 h-8 border-4 border-game-accent-light border-b-transparent rounded-full inline-block animate-spin"></span>
        </div>
      </div>
    </div>
  );
}

export default ConnectionError;
