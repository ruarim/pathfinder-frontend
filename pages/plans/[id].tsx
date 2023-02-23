import { useRouter } from "next/router";

export default function PlanConfig() {
  const router = useRouter();

  console.log(router.query.id);

  //getPlan

  //addParticipant mutaion

  //addChallenge mutation

  //display plan
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex-wrap space-y-3">
        <h1 className="text-4xl">COMING SOON! 🛠️</h1>
        <div>
          <p className="text-xl">Features</p>
          <p>-Invite your friends to view and edit plans.</p>
          <p>
            -Add games and challenges. (Winners of pool/darts/cards buy the
            round.. etc.)
          </p>
          <p>-Add timings.</p>
        </div>
      </div>
    </div>
  );
}