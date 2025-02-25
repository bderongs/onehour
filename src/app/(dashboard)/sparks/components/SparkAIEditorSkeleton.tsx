'use client'

import { ArrowLeft } from 'lucide-react'

export default function SparkAIEditorSkeleton() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Column - Chat Interface Skeleton */}
          <div className="lg:w-1/2">
            <div className="sticky top-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="text-gray-500 hover:text-gray-700 transition-colors">
                  <ArrowLeft className="h-6 w-6" />
                </div>
                <div className="h-10 bg-gray-200 rounded-md w-64 animate-pulse"></div>
              </div>
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 bg-blue-200 rounded-full animate-pulse"></div>
                    <div className="h-7 bg-gray-200 rounded-md w-48 animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-md w-full mt-2 animate-pulse"></div>
                </div>
                <div className="p-4 h-96 flex flex-col gap-4">
                  <div className="h-16 bg-gray-100 rounded-md w-full animate-pulse"></div>
                  <div className="h-16 bg-gray-100 rounded-md w-full animate-pulse"></div>
                  <div className="h-16 bg-gray-100 rounded-md w-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview Skeleton */}
          <div className="lg:w-1/2">
            <div className="space-y-6">
              {/* Spark Preview Skeleton */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <div className="h-7 bg-gray-200 rounded-md w-40 mb-4 animate-pulse"></div>
                <div className="space-y-4">
                  <div>
                    <div className="h-8 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-full mt-2 animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-5 bg-gray-200 rounded-md w-20 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded-md w-16 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Description Skeleton */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <div className="h-7 bg-gray-200 rounded-md w-48 mb-4 animate-pulse"></div>
                <div className="h-24 bg-gray-200 rounded-md w-full animate-pulse"></div>
              </div>

              {/* Methodology Skeleton */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <div className="h-7 bg-gray-200 rounded-md w-36 mb-4 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 bg-blue-200 rounded-full mt-0.5 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded-md w-full animate-pulse"></div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 bg-blue-200 rounded-full mt-0.5 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded-md w-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Target Audience Skeleton */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <div className="h-7 bg-gray-200 rounded-md w-32 mb-4 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 bg-blue-200 rounded-full mt-0.5 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded-md w-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 