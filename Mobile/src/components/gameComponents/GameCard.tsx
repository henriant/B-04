//     når brukeren hovrer over et spill i search-results eller library vises et gamecard av spillet. og når brukeren trykker på dette, blir dem sendt til GameInfo.tsx


function GameCard({ game }) {
  return (
    <div className="game-card">
      <h3>{game.name}</h3>
      <p>{game.description}</p>
      <button onClick={() => window.location.href = `/gameInfo/${game.id}`}>View Details</button>
    </div>
  )
}