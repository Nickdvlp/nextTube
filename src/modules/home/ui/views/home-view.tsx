import React from "react";
import CategoriesSection from "../sections/category-section";
import HomeVideosSection from "../sections/home-videos-section";

interface HomeProps {
  categoryId?: string;
}

const HomeView = ({ categoryId }: HomeProps) => {
  return (
    <div className="max-w-[1200px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <CategoriesSection categoryId={categoryId} />
      <HomeVideosSection categoryId={categoryId} />
    </div>
  );
};

export default HomeView;
