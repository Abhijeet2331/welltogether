// // Frontend (React + Next.js)
// import { useEffect, useState } from "react";
// import io from "socket.io-client";

// const socket = io("http://localhost:4000");

// export default function WatchParty() {
//     const [movies, setMovies] = useState(["Inception", "Interstellar", "The Dark Knight"]);
//     const [votes, setVotes] = useState({});
//     const [selectedMovie, setSelectedMovie] = useState(null);
//     const [videoTime, setVideoTime] = useState(0);
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [isAdmin, setIsAdmin] = useState(false);

//     useEffect(() => {
//         socket.on("updateVotes", (newVotes) => setVotes(newVotes));
//         socket.on("startMovie", ({ movie, time }) => {
//             setSelectedMovie(movie);
//             setVideoTime(time);
//             setIsPlaying(true);
//         });
//         socket.on("syncVideo", ({ time, playing }) => {
//             setVideoTime(time);
//             setIsPlaying(playing);
//         });
//     }, []);

//     const voteMovie = (movie) => {
//         socket.emit("vote", movie);
//     };

//     const startMovie = () => {
//         if (isAdmin) {
//             const topMovie = Object.keys(votes).reduce((a, b) => votes[a] > votes[b] ? a : b);
//             socket.emit("startMovie", { movie: topMovie, time: 0 });
//         }
//     };

//     const handleVideoControl = (action) => {
//         if (isAdmin) {
//             socket.emit("syncVideo", { action, time: videoTime });
//         }
//     };

//     return (
//         <div className="p-5 text-center">
//             <h1 className="text-xl font-bold">Watch Party</h1>
//             {!selectedMovie ? (
//                 <div>
//                     <h2 className="text-lg font-semibold">Vote for a Movie</h2>
//                     {movies.map((movie) => (
//                         <button key={movie} className="m-2 p-2 bg-blue-500 text-white" onClick={() => voteMovie(movie)}>
//                             {movie} ({votes[movie] || 0} votes)
//                         </button>
//                     ))}
//                     {isAdmin && <button className="block mt-4 p-2 bg-green-500 text-white" onClick={startMovie}>Start Movie</button>}
//                 </div>
//             ) : (
//                 <div>
//                     <h2 className="text-lg font-semibold">Now Watching: {selectedMovie}</h2>
//                     <iframe
//                         width="800"
//                         height="450"
//                         src={`https://www.youtube.com/embed/dQw4w9WgXcQ?start=${videoTime}&autoplay=${isPlaying ? 1 : 0}`}
//                         title="Movie Player"
//                         allowFullScreen
//                     ></iframe>
//                     {isAdmin && (
//                         <div className="mt-4">
//                             <button className="p-2 bg-yellow-500" onClick={() => handleVideoControl("pause")}>Pause</button>
//                             <button className="p-2 bg-green-500 ml-2" onClick={() => handleVideoControl("play")}>Play</button>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }
