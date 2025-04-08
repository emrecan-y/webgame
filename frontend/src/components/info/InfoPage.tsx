type InfoPageProps = {
  mainText: string;
};

function InfoPage({ mainText }: InfoPageProps) {
  return (
    <div className="animate-bounce rounded bg-game-accent-light p-2">
      <div className="rounded bg-game-accent-medium p-2 text-center text-game-main-light">
        <h1>{mainText}</h1>

        <div className="mt-1 flex items-center justify-center gap-1">
          <h1>Please wait</h1>
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-game-accent-light border-b-transparent"></span>
        </div>
      </div>
    </div>
  );
}

export default InfoPage;
