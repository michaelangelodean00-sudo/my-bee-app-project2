
import { Ad } from "../data/adsData";

interface AdCardProps {
  ad: Ad;
}

const AdCard = ({ ad }: AdCardProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center">
      <div className="w-full md:w-1/3 mb-2 md:mb-0 md:mr-4">
        <img 
          src={ad.imageUrl} 
          alt={ad.title} 
          className="rounded-lg w-full h-24 md:h-32 object-cover shadow-md"
        />
      </div>
      <div className="w-full md:w-2/3">
        <h3 className="text-lg font-bold mb-1">{ad.title}</h3>
        <p className="mb-2 text-sm">{ad.description}</p>
        <a 
          href={ad.linkUrl} 
          className="inline-block bg-bee-yellow text-bee-black px-3 py-1 rounded-md text-sm font-medium hover:bg-bee-yellow/90 transition-colors"
        >
          Get More Info
        </a>
      </div>
    </div>
  );
};

export default AdCard;
