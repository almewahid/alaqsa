import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Mic, Video, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// بيانات تجريبية - في تطبيق فعلي تأتي من API
const sampleVerses = {
  "سورة الفاتحة": {
    1: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    2: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    3: "الرَّحْمَٰنِ الرَّحِيمِ",
    4: "مَالِكِ يَوْمِ الدِّينِ",
    5: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    6: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    7: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ"
  }
};

export default function VerseDisplay({ surahName, verses, onAddComment }) {
  const [selectedText, setSelectedText] = useState("");
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [commentType, setCommentType] = useState(null);
  const [commentData, setCommentData] = useState("");

  // استخراج الآيات
  const parseVersesRange = (versesText) => {
    const match = versesText.match(/من الآية (\d+) إلى (\d+)/);
    if (match) {
      const from = parseInt(match[1]);
      const to = parseInt(match[2]);
      return { from, to };
    }
    return null;
  };

  const getVersesToDisplay = () => {
    const range = parseVersesRange(verses);
    if (!range || !sampleVerses[surahName]) return [];

    const versesData = [];
    for (let i = range.from; i <= range.to; i++) {
      if (sampleVerses[surahName][i]) {
        versesData.push({
          number: i,
          text: sampleVerses[surahName][i]
        });
      }
    }
    return versesData;
  };

  // عند تحديد النص
  const handleTextSelection = (verseNumber, selectedText) => {
    if (selectedText.trim()) {
      setSelectedText(selectedText);
      setSelectedVerse(verseNumber);
      setShowCommentDialog(true);
    }
  };

  // حفظ التعليق
  const handleSaveComment = () => {
    if (selectedText && selectedVerse && commentType) {
      const newComment = {
        word_or_verse: selectedText,
        verse_number: selectedVerse,
        comment_type: commentType,
        content: commentData,
        surah_name: surahName
      };

      onAddComment(newComment);
      setShowCommentDialog(false);
      setSelectedText("");
      setSelectedVerse(null);
      setCommentType(null);
      setCommentData("");
    }
  };

  const versesToDisplay = getVersesToDisplay();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="glass-effect shadow-lg border-emerald-200">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            {surahName} - {verses}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {versesToDisplay.length > 0 ? (
            <div className="space-y-6">
              {versesToDisplay.map((verse) => (
                <motion.div
                  key={verse.number}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: verse.number * 0.1 }}
                  className="p-4 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <Badge className="bg-emerald-100 text-emerald-800 font-semibold min-w-8 h-8 flex items-center justify-center rounded-full">
                      {verse.number}
                    </Badge>
                    <div
                      className="flex-1 text-right leading-loose text-xl arabic-text cursor-text select-text"
                      style={{ fontFamily: "Amiri, serif" }}
                      onMouseUp={() => {
                        const selection = window.getSelection();
                        const selectedText = selection.toString();
                        if (selectedText) {
                          handleTextSelection(verse.number, selectedText);
                        }
                      }}
                    >
                      {verse.text}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Comment Dialog */}
              {showCommentDialog && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                >
                  <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl text-center">
                    <h3 className="font-bold text-lg mb-4">إضافة تعليق</h3>
                    <div className="bg-gray-50 p-3 rounded-lg mb-4 text-right">
                      <p className="text-sm text-gray-600 mb-1">النص المحدد:</p>
                      <p className="font-medium arabic-text">{selectedText}</p>
                    </div>

                    {!commentType ? (
                      // اختيار نوع التعليق
                      <div className="space-y-3">
                        <Button
                          onClick={() => setCommentType("نصي")}
                          className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          إضافة تعليق نصي
                        </Button>

                        <Button
                          onClick={() => setCommentType("صوتي")}
                          className="w-full justify-start bg-green-600 hover:bg-green-700"
                        >
                          <Mic className="w-4 h-4 mr-2" />
                          إضافة تسجيل صوتي
                        </Button>

                        <Button
                          onClick={() => setCommentType("فيديو")}
                          className="w-full justify-start bg-red-600 hover:bg-red-700"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          إضافة رابط فيديو
                        </Button>
                      </div>
                    ) : (
                      // نموذج إدخال التعليق
                      <div className="space-y-4">
                        {commentType === "نصي" && (
                          <Textarea
                            value={commentData}
                            onChange={(e) => setCommentData(e.target.value)}
                            placeholder="أدخل التعليق النصي هنا..."
                            className="text-right"
                          />
                        )}

                        {commentType === "فيديو" && (
                          <Input
                            value={commentData}
                            onChange={(e) => setCommentData(e.target.value)}
                            placeholder="ضع رابط الفيديو هنا..."
                            className="text-right"
                          />
                        )}

                        {commentType === "صوتي" && (
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-700 mb-2">
                              تسجيل صوتي (ميزة تجريبية)
                            </p>
                            <Button className="bg-green-600 hover:bg-green-700">
                              <Mic className="w-4 h-4 ml-2" />
                              بدء التسجيل
                            </Button>
                          </div>
                        )}

                        <div className="flex gap-3 justify-center">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowCommentDialog(false);
                              setCommentType(null);
                              setCommentData("");
                            }}
                          >
                            إلغاء
                          </Button>
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={handleSaveComment}
                          >
                            حفظ
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                لا يمكن عرض الآيات - تحقق من اختيار السورة والآيات
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
