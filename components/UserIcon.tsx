export default function AvatarIcon({ imageUrl }: { imageUrl: string }) {
  return (
    <div>
      <img className="h-8 w-8 rounded-full" src={imageUrl} alt="" />
    </div>
  );
}
