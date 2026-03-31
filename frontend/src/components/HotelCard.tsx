import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  rating: number;
  // A luxury UI needs photos, even if the backend hotel payload doesn't have a direct top-level image.
  // We will assume `rooms[0]?.photos[0]?.url` or a placeholder.
  rooms?: any[];
}

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  // Extract a preview image from rooms if available, else a luxury placeholder
  const imageUrl = hotel.rooms?.[0]?.photos?.[0]?.url || 'https://images.unsplash.com/photo-1542314831-c6a4d14b4ced?auto=format&fit=crop&q=80&w=800';

  return (
    <Link to={`/hotels/${hotel.id}`} className="block group">
      <div className="bg-card rounded-xl overflow-hidden border border-border/50 hover:border-gold-500/50 transition-all duration-300 shadow-lg hover:shadow-gold-500/10 h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={hotel.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
          <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-2 py-1 rounded flex items-center gap-1 border border-border/50">
            <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
            <span className="text-sm font-medium">{hotel.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-xl font-serif text-foreground mb-2 group-hover:text-gold-400 transition-colors">{hotel.name}</h3>
          
          <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{hotel.location}</span>
          </div>
          
          <p className="text-muted-foreground text-sm line-clamp-2 mt-auto">
            {hotel.description || 'Experience the pinnacle of hospitality and elegance at our finest locations.'}
          </p>
        </div>
      </div>
    </Link>
  );
}
