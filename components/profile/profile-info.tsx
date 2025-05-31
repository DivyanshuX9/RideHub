'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { User, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { userProfile } from '@/lib/mock-data';

export function ProfileInfo() {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative w-32 h-32 mb-4 overflow-hidden rounded-full border-4 border-background shadow-md"
      >
        <Image
          src={userProfile.profileImage}
          alt="Profile Picture"
          fill
          className="object-cover"
        />
      </motion.div>
      
      <h3 className="text-xl font-bold mb-1">{userProfile.name}</h3>
      
      <div className="space-y-2 mt-4 w-full">
        <div className="flex items-center space-x-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{userProfile.email}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{userProfile.phone}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Member since {new Date(userProfile.memberSince).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {userProfile.totalRides} total rides
          </span>
        </div>
      </div>
      
      <div className="mt-6 w-full">
        <h4 className="text-sm font-medium mb-2">Saved Locations</h4>
        <div className="space-y-2">
          {userProfile.savedLocations.map((location) => (
            <div 
              key={location.id}
              className="flex items-start space-x-2 text-sm p-2 rounded-md hover:bg-accent transition-colors"
            >
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-left">{location.name}</div>
                <div className="text-xs text-muted-foreground">{location.address}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Button variant="outline" size="sm" className="mt-6 w-full">
        Edit Profile
      </Button>
    </div>
  );
}