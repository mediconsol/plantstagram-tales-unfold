import { PlantPost } from "./PlantPost";
import photosynthesisSelca from "@/assets/photosynthesis-selca.jpg";
import beeFriendship from "@/assets/bee-friendship.jpg";
import autumnDiary from "@/assets/autumn-diary.jpg";
import growthJournal from "@/assets/growth-journal.jpg";

const plantPosts = [
  {
    id: "photosynthesis",
    username: "잎새_햇살받기",
    profileEmoji: "🌿",
    image: photosynthesisSelca,
    caption: "오늘도 햇살이 너무 따뜻해서 기분이 좋아요! 광합성하는 맛이 일품이에요 ☀️",
    hashtags: ["광합성셀카", "햇살", "기분좋은월요일", "초록초록"],
    likes: 2847,
    timeAgo: "3시간 전"
  },
  {
    id: "bee-meeting",
    username: "꽃송이_향기",
    profileEmoji: "🌸",
    image: beeFriendship,
    caption: "오늘 새로운 친구를 만났어요! 정말 부지런한 친구네요. 서로 도움이 되는 관계가 최고 🐝",
    hashtags: ["벌과의첫만남", "새친구", "서로도움", "꿀벌친구"],
    likes: 5124,
    timeAgo: "5시간 전"
  },
  {
    id: "autumn-diary",
    username: "나무_계절일기",
    profileEmoji: "🍂",
    image: autumnDiary,
    caption: "가을이 되면서 옷을 갈아입어요. 조용히 이별하는 법을 배우고 있어요.",
    hashtags: ["낙엽일기", "가을감성", "이별", "계절의변화"],
    likes: 8291,
    timeAgo: "1일 전"
  },
  {
    id: "growth",
    username: "새싹_매일성장",
    profileEmoji: "🌱",
    image: growthJournal,
    caption: "어제보다 조금 더 자랐어요! 매일매일이 새로운 도전이고 성장이에요 💚",
    hashtags: ["성장일지", "매일조금씩", "새싹일기", "희망"],
    likes: 3456,
    timeAgo: "2일 전"
  }
];

export const NarrativeSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-pretendard text-3xl md:text-4xl font-bold text-foreground mb-6">
            오늘의 식물 피드 🌿
          </h2>
          <p className="font-pretendard text-lg text-muted-foreground max-w-2xl mx-auto">
            식물들이 오늘 하루 어떤 순간들을 기록했는지 함께 보아요
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {plantPosts.map((post, index) => (
            <div 
              key={post.id}
              className="opacity-0 animate-fade-in-up"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationFillMode: 'forwards'
              }}
            >
              <PlantPost {...post} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};