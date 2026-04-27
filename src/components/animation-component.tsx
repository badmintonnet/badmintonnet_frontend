"use client";
import React, { useState, useEffect } from "react";
import { Users, UserPlus, Calendar, Award, ChevronRight } from "lucide-react";

const ClubProcessAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Tìm kiếm Câu lạc bộ",
      description: "Tìm kiếm và chọn CLB yêu thích của bạn",
      icon: UserPlus,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      delay: 0,
    },
    {
      id: 2,
      title: "Đăng kí tham gia",
      description: "Đăng kí tham gia và chờ đợi phê duyệt",
      icon: Users,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-950",
      delay: 0.3,
    },
    {
      id: 3,
      title: "Tham Gia Hoạt động",
      description: "Tham gia các hoạt động và các buổi giao lưu thành viên",
      icon: Calendar,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      delay: 0.6,
    },
    {
      id: 4,
      title: "Phát Triển Bản Thân",
      description: "Phát triển kỹ năng và ghi nhận thành tích",
      icon: Award,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
      delay: 0.9,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
        setIsAnimating(false);
      }, 200);
    }, 1000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="">
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-20 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = index === currentStep;
              const isPassed = index < currentStep;

              return (
                <div key={step.id} className="relative">
                  {/* Step Card */}
                  <div
                    className={`
                    relative p-8 rounded-2xl border-2 transition-all duration-700 transform
                    ${
                      isActive
                        ? `${step.bgColor} border-current shadow-2xl scale-105 -translate-y-2`
                        : isPassed
                          ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 shadow-md"
                          : "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700 shadow-sm"
                    }
                    ${isAnimating && isActive ? "animate-pulse" : ""}
                  `}
                  >
                    {/* Step Number */}
                    <div
                      className={`
                      absolute -top-4 left-6 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                      bg-gradient-to-r ${step.color} shadow-lg
                      ${isActive ? "animate-bounce" : ""}
                    `}
                    >
                      {step.id}
                    </div>

                    {/* Icon */}
                    <div
                      className={`
                      w-16 h-16 rounded-2xl mb-6 flex items-center justify-center transition-all duration-500
                      bg-gradient-to-r ${step.color}
                      ${isActive ? "animate-pulse scale-110" : ""}
                    `}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3
                      className={`
                      text-xl font-bold mb-3 transition-colors duration-500
                      ${
                        isActive
                          ? "text-gray-800 dark:text-white"
                          : "text-gray-600 dark:text-gray-300"
                      }
                    `}
                    >
                      {step.title}
                    </h3>

                    <p
                      className={`
                      text-sm leading-relaxed transition-colors duration-500
                      ${
                        isActive
                          ? "text-gray-700 dark:text-gray-200"
                          : "text-gray-500 dark:text-gray-400"
                      }
                    `}
                    >
                      {step.description}
                    </p>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl opacity-20 animate-pulse" />
                    )}

                    {/* Arrow for non-last steps */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                        <ChevronRight
                          className={`
                          w-8 h-8 transition-all duration-500
                          ${
                            isPassed || isActive
                              ? "text-blue-500"
                              : "text-gray-300 dark:text-gray-600"
                          }
                        `}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${
                  index === currentStep
                    ? "bg-blue-500 scale-125"
                    : index < currentStep
                      ? "bg-green-400"
                      : "bg-gray-300 dark:bg-gray-600"
                }
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubProcessAnimation;
