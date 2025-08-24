import CreateEventForm from "./create-form";
import React from "react";

const CreateEventPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-4xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Tạo Sự Kiện Thể Thao
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Tạo và quản lý các sự kiện thể thao một cách chuyên nghiệp và dễ
            dàng
          </p>

          {/* Decorative Elements */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-600"></div>
            <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"></div>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-blue-600"></div>
          </div>
        </div>

        {/* Form Component */}
        <CreateEventForm />
      </div>
    </div>
  );
};

export default CreateEventPage;
