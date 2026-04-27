// app/(main)/_components/home-page/welcome-card.tsx

type WelcomeCardProps = {
  fullName: string;
};

export default function WelcomeCard({ fullName }: WelcomeCardProps) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Chào buổi sáng"
      : hour < 18
        ? "Chào buổi chiều"
        : "Chào buổi tối";

  return (
    <section className="relative overflow-hidden rounded-3xl">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700" />

      {/* Overlay làm dịu nền */}
      <div className="absolute inset-0 bg-black/25 dark:bg-black/35" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16 text-center text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          {greeting}, <span className="text-lime-300">{fullName}</span>
        </h1>

        <p className="text-base md:text-xl max-w-3xl mx-auto leading-relaxed text-white/90">
          Chào mừng bạn quay trở lại BadmintonNet – nơi kết nối cộng đồng cầu
          lông, tham gia câu lạc bộ, hoạt động và các giải đấu trên khắp Việt
          Nam.
        </p>

        {/* Decorative divider */}
        <div className="mt-8 flex justify-center">
          <div className="w-28 h-1 bg-white/50 rounded-full" />
        </div>
      </div>

      {/* Subtle light effect */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
