"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info, Users, Calendar } from "lucide-react";
import CategoryParticipants from "./category-participants";
import CategorySchedule from "@/app/(main)/tournaments/[id]/categories/[categoryId]/_components/category-schedule";
import CategoryOverview from "@/app/(main)/tournaments/[id]/categories/[categoryId]/_components/category-overview";
import { CategoryDetail } from "@/schemaValidations/tournament.schema";
import CategoryTeamParticipants from "@/app/(main)/tournaments/[id]/categories/[categoryId]/_components/category-team-participants";

interface CategoryTabsProps {
  category: CategoryDetail;
}

export default function CategoryTabs({ category }: CategoryTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <TabsTrigger value="overview">
          <Info className="w-4 h-4 mr-2" />
          Thông tin
        </TabsTrigger>
        {!category.double ? (
          <TabsTrigger value="participants">
            <Users className="w-4 h-4 mr-2" />
            Người tham gia ({category.currentParticipantCount})
          </TabsTrigger>
        ) : (
          <TabsTrigger value="team-participants">
            <Users className="w-4 h-4 mr-2" />
            Đội tham gia ({category.currentParticipantCount})
          </TabsTrigger>
        )}
        <TabsTrigger value="schedule">
          <Calendar className="w-4 h-4 mr-2" />
          Lịch thi đấu & Kết quả
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <CategoryOverview category={category} />
      </TabsContent>
      {!category.double ? (
        <TabsContent value="participants" className="mt-6">
          <CategoryParticipants
            categoryId={category.id}
            isAdmin={category.admin}
          />
        </TabsContent>
      ) : (
        <TabsContent value="team-participants" className="mt-6">
          <CategoryTeamParticipants
            categoryId={category.id}
            isAdmin={category.admin}
          />
        </TabsContent>
      )}

      <TabsContent value="schedule" className="mt-6">
        <CategorySchedule category={category} />
      </TabsContent>
    </Tabs>
  );
}
