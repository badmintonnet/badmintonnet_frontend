import { HighlightType } from '@/schemaValidations/highlight.schema';

// Dữ liệu giả cho highlights
export const mockHighlights: HighlightType[] = [
  {
    id: '1',
    eventId: 'event-123',
    userId: 'user-1',
    userName: 'Nguyễn Văn A',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    content: 'Rất vui khi được tham gia giải đấu này! Đã có những trận đấu tuyệt vời và gặp gỡ nhiều bạn mới. Mong chờ giải đấu tiếp theo! 🏆',
    mediaUrls: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2070&auto=format&fit=crop'
    ],
    mediaType: 'IMAGE',
    createdAt: '2023-11-15T08:30:00Z',
    likes: 15,
    comments: 3,
  },
  {
    id: '2',
    eventId: 'event-123',
    userId: 'user-2',
    userName: 'Trần Thị B',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    content: 'Lần đầu tiên tham gia giải và đã giành được giải ba! Cảm ơn ban tổ chức đã tạo ra một sân chơi tuyệt vời. Hẹn gặp lại mọi người ở giải sau! 🥉',
    mediaUrls: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2070&auto=format&fit=crop'
    ],
    mediaType: 'IMAGE',
    createdAt: '2023-11-14T15:45:00Z',
    likes: 27,
    comments: 8,
  },
  {
    id: '3',
    eventId: 'event-123',
    userId: 'user-3',
    userName: 'Lê Văn C',
    userAvatar: 'https://i.pravatar.cc/150?img=8',
    content: 'Giải đấu đã diễn ra rất thành công! Cảm ơn tất cả các vận động viên đã tham gia và chúc mừng các bạn đã giành chiến thắng. Hẹn gặp lại mọi người ở giải đấu tiếp theo! 🎉',
    mediaUrls: [],
    createdAt: '2023-11-13T10:20:00Z',
    likes: 42,
    comments: 12,
  },
  {
    id: '4',
    eventId: 'event-123',
    userId: 'user-4',
    userName: 'Phạm Thị D',
    userAvatar: 'https://i.pravatar.cc/150?img=9',
    content: 'Đã có một ngày thi đấu tuyệt vời! Dù không đạt giải nhưng đã học hỏi được rất nhiều từ các đối thủ. Cảm ơn ban tổ chức đã tạo ra một sân chơi công bằng và chuyên nghiệp. 👍',
    mediaUrls: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2070&auto=format&fit=crop'
    ],
    mediaType: 'IMAGE',
    createdAt: '2023-11-12T14:10:00Z',
    likes: 19,
    comments: 5,
  },
];