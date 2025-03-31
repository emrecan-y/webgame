import { BirCardBack } from "../BirCard";

type BirCardFanProps = {
  cardCount: number;
};

function BirCardFan({ cardCount }: BirCardFanProps) {
  if (cardCount == 1) {
    return (
      <div className="relative flex h-16 w-32 flex-col items-center justify-center sm:h-24">
        <div className="flex h-0 w-0 scale-[0.2] items-center justify-center sm:scale-[0.24]">
          <div>
            <BirCardBack />
          </div>
        </div>

        <p className="absolute bottom-0 h-7 w-7 rounded-full bg-game-accent-medium text-center align-middle font-bold text-bir-white outline">
          <span className="text-center align-middle text-bir-yellow drop-shadow-bir-small-text">
            {cardCount}
          </span>
        </p>
      </div>
    );
  } else {
    const cardCountToShow = cardCount > 13 ? 13 : cardCount;
    const arcAngle = 50;
    const anglePerCard = (arcAngle / cardCountToShow) * 2;
    return (
      <div className="relative flex h-16 w-32 flex-col items-center justify-center sm:h-24">
        <div className="flex h-0 w-0 scale-[0.2] items-center justify-center sm:scale-[0.24]">
          {Array.from(Array(cardCountToShow)).map((_, index) => (
            <div
              key={index}
              className="-mx-11"
              style={{
                transform: `translateY(${Math.abs(Math.floor(cardCountToShow / 2) - index) * 10}px) rotate(${index * anglePerCard - arcAngle}deg)`,
              }}
            >
              <BirCardBack />
            </div>
          ))}
        </div>
        <p className="absolute bottom-0 h-7 w-7 rounded-full bg-game-accent-medium text-center align-middle font-bold text-bir-white outline">
          <span className="text-center align-middle text-bir-yellow drop-shadow-bir-small-text">
            {cardCount}
          </span>
        </p>
      </div>
    );
  }
}

export default BirCardFan;
