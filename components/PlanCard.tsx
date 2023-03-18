interface PlanCardProps {
  plan: Plan;
}

export default function PlanCard({ plan }: PlanCardProps) {
  return (
    <div>
      <div>{plan.name}</div>
      <div>{plan.start_date}</div>
      <div>{plan.start_time}</div>
      {plan.venues.map((venue) => (
        <div>
          <h2>{venue.name}</h2>
          <div>
            {venue.attributes.map((attribute) => (
              <div>{attribute}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
