'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSelectedLayoutSegments } from 'next/navigation';

type PageType = 'profile' | 'marketing' | 'consultant' | 'client' | 'public';

interface PageTypeContextValue {
  pageType: PageType;
  isProfilePage: boolean;
  isConsultantSection: boolean;
  isMarketingPage: boolean;
}

const PageTypeContext = createContext<PageTypeContextValue | undefined>(undefined);

// Helper function to determine page type from route segments
function getPageTypeFromSegments(segments: string[]): PageType {
  // Remove route group markers (segments in parentheses)
  const cleanSegments = segments.map(s => s.replace(/^\((.+)\)$/, '$1'));
  
  // Check for profile pages
  if (cleanSegments.includes('profile') || 
      (cleanSegments.length === 1 && !['pricing', 'consultants', 'privacy', 'terms', 'signin', 'signup'].includes(cleanSegments[0]))) {
    return 'profile';
  }
  
  // Check for marketing pages
  if (cleanSegments.includes('marketing')) {
    return 'marketing';
  }
  
  // Check for consultant pages
  if (cleanSegments.includes('consultant') || cleanSegments.includes('consultants')) {
    return 'consultant';
  }
  
  // Check for client pages
  if (cleanSegments.includes('client')) {
    return 'client';
  }
  
  // Default to public
  return 'public';
}

export function PageTypeProvider({ 
  children,
  // Make pageType prop optional
  pageType: explicitPageType
}: { 
  children: ReactNode;
  pageType?: PageType;
}) {
  // Get route segments from Next.js
  const segments = useSelectedLayoutSegments();
  
  // Use explicit pageType if provided, otherwise determine from route
  const pageType = explicitPageType ?? getPageTypeFromSegments(segments);

  const value = {
    pageType,
    isProfilePage: pageType === 'profile',
    isConsultantSection: pageType === 'consultant',
    isMarketingPage: pageType === 'marketing'
  };

  return (
    <PageTypeContext.Provider value={value}>
      {children}
    </PageTypeContext.Provider>
  );
}

export function usePageType() {
  const context = useContext(PageTypeContext);
  if (context === undefined) {
    throw new Error('usePageType must be used within a PageTypeProvider');
  }
  return context;
} 
