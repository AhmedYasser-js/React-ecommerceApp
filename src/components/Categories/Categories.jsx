// CategoriesMarquee.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { RingLoader } from "react-spinners";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const trackRef = useRef(null);
  // سرعة البكسل لكل ثانية (اضبطها لتصبح أسرع/أبطأ)
  const SPEED_PX_PER_SEC = 120;

  useEffect(() => {
    async function fetchCats() {
      setIsLoading(true);
      try {
        const res = await axios.get("https://ecommerce.routemisr.com/api/v1/categories");
        setCategories(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCats();
  }, []);

  // بعد ما كل الصور الاصلية تحمل، نقيس العرض ونحسب مدة الأنيميشن
  useEffect(() => {
    if (!trackRef.current) return;
    if (categories.length === 0) return;
    if (imagesLoaded < categories.length) return; // ننتظر تحميل صور المجموعة الأصلية

    const track = trackRef.current;
    const totalWidth = track.scrollWidth; // هذا عرض المحتوى المكرر (orig + copy)
    const oneSetWidth = totalWidth / 2; // عرض مجموعة واحدة
    const durationSeconds = Math.max(10, oneSetWidth / SPEED_PX_PER_SEC); // أقل مدة 10s لتجنب جداً سريع
    // نضع المدة كـ CSS variable ليستخدمها ال keyframes
    track.style.setProperty("--marquee-duration", `${durationSeconds}s`);
  }, [categories, imagesLoaded]);

  // لو لا توجد بيانات أو جار التحميل
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RingLoader color="#22c55e" size={60} />
      </div>
    );
  }

  // نكرر العناصر (orig + copy) لخلق تأثير infinite marquee
  const items = [...categories, ...categories];

  return (
    <div className="container mx-auto">
      <h3 className="text-center text-3xl font-bold mb-8 text-green-600">🛍️ Our Categories</h3>

      {/* الماركيه */}
      <div className="relative overflow-hidden bg-white py-6 rounded-xl shadow ">
        {/* track: flex row يحوي العناصر المكررة، والأنيميشن يتحرك translateX -50% */}
        <div
          ref={trackRef}
          className="flex items-center gap-6 whitespace-nowrap will-change-transform marquee-track"
          style={{
            // default duration لو القياس لم يتم بعد
            ["--marquee-duration"]: "30s",
            // تضمن أن ال track يعرض inline content بشكل صحيح
            // (لا حاجة لأكثر هنا لأن css أدناه يتعامل معه)
          }}
        >
          {items.map((cat, idx) => {
            // حتى نحسب عدد الصور المحمّلة فقط لأول مجموعة:
            const isOriginal = idx < categories.length;
            return (
              <div
                key={`${cat._id}-${idx}`}
                className="flex flex-col items-center justify-center min-w-[140px] md:min-w-[160px]"
              >
                <div className="w-28 h-28 md:w-60  md:h-60 rounded-full overflow-hidden border-4 border-green-100 shadow-lg">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full  object-cover transform transition-transform duration-500"
                    onLoad={() => {
                      // نعد صور المجموعة الأصلية فقط (مش العد للمجموعة المكررة)
                      if (isOriginal) setImagesLoaded((p) => p + 1);

                    }}
                    // لا نستخدم onError خاص هنا لكن يمكنك إضافة صورة بديلة إن أردت
                  />
                </div>
                <p className="mt-2 text-sm md:text-base font-medium text-gray-700">
                  {cat.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* styles مدموجة هنا لعزلها — ممكن تنقلها لملف CSS */}
      <style>{`
        .marquee-track {
          display: flex;
        /* align-items: center;*/
          gap: 5.5rem; /* المسافة بين العناصر */
          white-space: nowrap; /* لا تكسر الأسطر */
          animation: marquee var(--marquee-duration) linear infinite;
        }

        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* لو أردت الإيقاف عند المرور: أزل التعليق عن السطر التالي */
        /* .marquee-track:hover { animation-play-state: paused; } */

        /* تحسين responsiveness للصورة والنّص داخل الماركيه */
        @media (max-width: 640px) {
          .marquee-track > div { min-width: 120px; }
        }
      `}</style>
    </div>
  );
}
