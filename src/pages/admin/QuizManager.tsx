import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  X,
  Edit,
  ChevronsLeftIcon,
  Delete,
  DeleteIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { useApi } from "../../hooks/useApi";
import {
  createQuiz,
  deleteQuiz,
  deleteQuizByID,
  getAllQuiz,
  updateQuiz,
} from "../../services/quiz";
import Loader from "../../components/ui/Loader";
import type { QuizData, UpdateQuizPayload } from "../../utils/types/quiz";
import ConfirmModal from "../../components/common/ConfirmModal";

interface Question {
  question_id: string;
  question: string;
  options: string[];
  correct_answer: string;
}

interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
  total_questions: number;
  created_at: string;
  created_by: string;
  updated_at?: string;
  updated_by?: string;
}

interface ApiQuizResponse {
  quizzes: Quiz[];
  status: boolean;
  total: number;
}

const QuizManager = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isQuizDeleted, setIsQuizDeleted] = useState<boolean>(false);
  const { callApi: callGetAllQuiz, loading: loadingQuizzes } =
    useApi(getAllQuiz);
  const { callApi: callUpdateQuiz, loading: loadingUpdateQuizzes } =
    useApi(updateQuiz);
  const { callApi: callDeleteQuiz, loading: loadingDeleteQuizzes } =
    useApi(deleteQuiz);
  const { callApi: callDeleteQuizID, loading: loadingDeleteQuizzesID } =
    useApi(deleteQuizByID);
  const { callApi, loading } = useApi(createQuiz);
  const [currentQuiz, setCurrentQuiz] = useState<
    Omit<
      Quiz,
      "_id" | "created_at" | "created_by" | "updated_at" | "updated_by"
    >
  >({
    title: "",
    questions: [],
    total_questions: 0,
  });
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question_id: "",
    question: "",
    options: ["", "", "", ""],
    correct_answer: "",
  });

  const generateQuestionId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast.info("Please enter a question");
      return;
    }

    if (currentQuestion.options.some((opt) => !opt.trim())) {
      toast.info("Please fill all options");
      return;
    }

    if (!currentQuestion.correct_answer) {
      toast.info("Please select a correct answer");
      return;
    }

    const newQuestion: Question = {
      ...currentQuestion,
      question_id: generateQuestionId(),
    };

    setCurrentQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      total_questions: prev.questions.length + 1,
    }));
    setCurrentQuestion({
      question_id: "",
      question: "",
      options: ["", "", "", ""],
      correct_answer: "",
    });
  };

  const removeQuestion = async (questionId: string) => {
    if (editingQuiz) {
      const response = await callDeleteQuiz(editingQuiz._id, questionId);
      response.status && toast.success(response.message);
      setEditingQuiz((prev) =>
        prev
          ? {
              ...prev,
              questions: prev.questions.filter(
                (q) => q.question_id !== questionId
              ),
              total_questions: prev.questions.length - 1,
            }
          : null
      );
    } else {
      setCurrentQuiz((prev) => ({
        ...prev,
        questions: prev.questions.filter((q) => q.question_id !== questionId),
        total_questions: prev.questions.length - 1,
      }));
    }
  };

  const updateOption = (index: number, value: string, questionId?: string) => {
    if (editingQuiz && questionId) {
      // Update option in editing quiz
      const updatedQuestions = editingQuiz.questions.map((q) => {
        if (q.question_id === questionId) {
          const newOptions = [...q.options];
          newOptions[index] = value;
          return { ...q, options: newOptions };
        }
        return q;
      });
      setEditingQuiz((prev) =>
        prev ? { ...prev, questions: updatedQuestions } : null
      );
    } else {
      // Update option in new question
      const newOptions = [...currentQuestion.options];
      newOptions[index] = value;
      setCurrentQuestion((prev) => ({
        ...prev,
        options: newOptions,
      }));
    }
  };

  const updateQuestionText = (questionId: string, newText: string) => {
    if (editingQuiz) {
      const updatedQuestions = editingQuiz.questions.map((q) =>
        q.question_id === questionId ? { ...q, question: newText } : q
      );
      setEditingQuiz((prev) =>
        prev ? { ...prev, questions: updatedQuestions } : null
      );
    }
  };

  const updateCorrectAnswer = (questionId: string, correctAnswer: string) => {
    if (editingQuiz) {
      const updatedQuestions = editingQuiz.questions.map((q) =>
        q.question_id === questionId
          ? { ...q, correct_answer: correctAnswer }
          : q
      );
      setEditingQuiz((prev) =>
        prev ? { ...prev, questions: updatedQuestions } : null
      );
    } else {
      setCurrentQuestion((prev) => ({
        ...prev,
        correct_answer: correctAnswer,
      }));
    }
  };

  const saveQuiz = async () => {
    if (!currentQuiz.title.trim()) {
      toast.error("Please enter a quiz title");
      return;
    }

    if (currentQuiz.questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    const payload = {
      title: currentQuiz.title,
      questions: currentQuiz.questions.map((q) => ({
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
      })),
    };

    const response = await callApi(payload);

    if (response.status) {
      toast.success(response?.message);
      await fetchQuizzes();
      setShowAddQuiz(false);
      setCurrentQuiz({
        title: "",
        questions: [],
        total_questions: 0,
      });
    }
  };

  const cancelQuiz = () => {
    setCurrentQuiz({
      title: "",
      questions: [],
      total_questions: 0,
    });
    setCurrentQuestion({
      question_id: "",
      question: "",
      options: ["", "", "", ""],
      correct_answer: "",
    });
    setShowAddQuiz(false);
    setEditingQuiz(null);
  };

  const handleViewDetails = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setShowAddQuiz(false);
  };

  const handleUpdateQuiz = async () => {
    if (!editingQuiz) return;

    try {
      const originalQuiz = quizzes.find((quiz) => quiz._id === editingQuiz._id);

      if (!originalQuiz) {
        toast.error("Original quiz data not found");
        return;
      }

      // Prepare payload with only changed data
      const payload: any = {};
      if (editingQuiz.title !== originalQuiz.title) {
        payload.title = editingQuiz.title;
      }
      const updatedQuestions = editingQuiz.questions
        .map((updatedQ) => {
          const originalQ = originalQuiz.questions.find(
            (q) => q.question_id === updatedQ.question_id
          );
          if (!originalQ) {
            return {
              question: updatedQ.question,
              options: updatedQ.options,
              correct_answer: updatedQ.correct_answer,
            };
          }
          if (
            updatedQ.question !== originalQ.question ||
            JSON.stringify(updatedQ.options) !==
              JSON.stringify(originalQ.options) ||
            updatedQ.correct_answer !== originalQ.correct_answer
          ) {
            return {
              question_id: updatedQ.question_id,
              question: updatedQ.question,
              options: updatedQ.options,
              correct_answer: updatedQ.correct_answer,
            };
          }

          return null;
        })
        .filter((q) => q !== null);
      if (updatedQuestions.length > 0) {
        payload.questions = updatedQuestions;
      }
      if (Object.keys(payload).length === 0) {
        toast.info("No changes detected");
        return;
      }

      const response = await callUpdateQuiz(editingQuiz._id, payload);

      if (response?.status) {
        toast.success("Quiz updated successfully!");
        setQuizzes((prev) =>
          prev.map((quiz) =>
            quiz._id === editingQuiz._id ? editingQuiz : quiz
          )
        );
        setEditingQuiz(null);
      } else {
        toast.error("Failed to update quiz. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
  };
  const handleDeleteQuiz = async (quizID: string) => {
    const response = await callDeleteQuizID(quizID);
    toast.success(response.message);
    setIsQuizDeleted((pre) => !pre);
    setConfirmDelete(null);
  };

  const addQuestionToEditingQuiz = () => {
    if (!editingQuiz) return;

    if (!currentQuestion.question.trim()) {
      toast.info("Please enter a question");
      return;
    }

    if (currentQuestion.options.some((opt) => !opt.trim())) {
      toast.info("Please fill all options");
      return;
    }

    if (!currentQuestion.correct_answer) {
      toast.info("Please select a correct answer");
      return;
    }

    const newQuestion: Question = {
      ...currentQuestion,
      question_id: generateQuestionId(),
    };

    setEditingQuiz((prev) =>
      prev
        ? {
            ...prev,
            questions: [...prev.questions, newQuestion],
            total_questions: prev.questions.length + 1,
          }
        : null
    );

    setCurrentQuestion({
      question_id: "",
      question: "",
      options: ["", "", "", ""],
      correct_answer: "",
    });
  };

  const fetchQuizzes = async () => {
    const quizResponse: ApiQuizResponse = await callGetAllQuiz();
    if (quizResponse.status && quizResponse.quizzes) {
      setQuizzes(quizResponse.quizzes);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [isQuizDeleted]);

  return (
    <div className="h-screen overflow-scroll p-6">
      <div className="space-y-8 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quiz Manager</h1>
        </div>

        {loadingQuizzes ? (
          <div className="flex justify-center">
            <Loader size="md" />
          </div>
        ) : (
          <>
            {/* // multiple Quizzz */}
            {/* {!showAddQuiz && !editingQuiz && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowAddQuiz(true)}
                  className="btn flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add New Quiz
                </button>
              </div>
            )} */}
            {!showAddQuiz && !editingQuiz && quizzes.length === 0 && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowAddQuiz(true)}
                  className="btn flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add New Quiz
                </button>
              </div>
            )}

            {(showAddQuiz || editingQuiz) && (
              <div className="space-y-6">
                <div className="rounded-lg border bg-card p-6">
                  <div className="space-y-4 mb-6">
                    <label className="text-sm font-medium">Quiz Title</label>
                    <input
                      type="text"
                      value={
                        editingQuiz ? editingQuiz.title : currentQuiz.title
                      }
                      onChange={(e) =>
                        editingQuiz
                          ? setEditingQuiz((prev) =>
                              prev ? { ...prev, title: e.target.value } : null
                            )
                          : setCurrentQuiz((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                      }
                      placeholder="Enter quiz title (e.g., Science, Math, History)"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-4 mb-6 p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold">Add New Question</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Question</label>
                      <textarea
                        value={currentQuestion.question}
                        onChange={(e) =>
                          setCurrentQuestion((prev) => ({
                            ...prev,
                            question: e.target.value,
                          }))
                        }
                        placeholder="Enter your question here..."
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Options</label>
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={currentQuestion.correct_answer === option}
                            onChange={() =>
                              setCurrentQuestion((prev) => ({
                                ...prev,
                                correct_answer: option,
                              }))
                            }
                            className="h-4 w-4"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              updateOption(index, e.target.value)
                            }
                            placeholder={`Option ${index + 1}`}
                            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={
                        editingQuiz ? addQuestionToEditingQuiz : addQuestion
                      }
                      className="btn flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Question
                    </button>
                  </div>
                  {(currentQuiz.questions.length > 0 ||
                    (editingQuiz && editingQuiz.questions.length > 0)) && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Questions (
                        {
                          (editingQuiz
                            ? editingQuiz.questions
                            : currentQuiz.questions
                          ).length
                        }
                        )
                      </h3>
                      {(editingQuiz
                        ? editingQuiz.questions
                        : currentQuiz.questions
                      ).map((question, index) => (
                        <div
                          key={question.question_id}
                          className="p-4 border rounded-lg bg-muted/50"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 space-y-3">
                              <div>
                                <label className="text-sm font-medium">
                                  Question {index + 1}
                                </label>
                                <textarea
                                  value={question.question}
                                  onChange={(e) =>
                                    updateQuestionText(
                                      question.question_id,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter your question here..."
                                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Options
                                </label>
                                {question.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className="flex items-center gap-3"
                                  >
                                    <input
                                      type="radio"
                                      name={`correctAnswer-${question.question_id}`}
                                      checked={
                                        question.correct_answer === option
                                      }
                                      onChange={() =>
                                        updateCorrectAnswer(
                                          question.question_id,
                                          option
                                        )
                                      }
                                      className="h-4 w-4"
                                    />
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) =>
                                        updateOption(
                                          optIndex,
                                          e.target.value,
                                          question.question_id
                                        )
                                      }
                                      placeholder={`Option ${optIndex + 1}`}
                                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                removeQuestion(question.question_id)
                              }
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-6">
                    <button className="btn-outline" onClick={cancelQuiz}>
                      Cancel
                    </button>
                    <button
                      onClick={editingQuiz ? handleUpdateQuiz : saveQuiz}
                      className="btn flex items-center gap-2"
                      disabled={
                        loading ||
                        (editingQuiz
                          ? editingQuiz.questions.length === 0
                          : currentQuiz.questions.length === 0)
                      }
                    >
                      {loading ? (
                        <>
                          <Loader size="sm" color="white" />
                          {editingQuiz ? "Updating..." : "Saving..."}
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          {editingQuiz ? "Update Quiz" : "Save Quiz"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {quizzes.length > 0 && !showAddQuiz && !editingQuiz && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Existing Quizzes</h2>
                <div className="grid gap-4">
                  {/* multiple quizz */}
                  {/* {quizzes.map((quiz) => (
                    <div
                      key={quiz._id}
                      className="p-4 border rounded-lg bg-card"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {quiz.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {quiz.total_questions} questions
                          </p>
                          <p className="text-sm text-gray-500">
                            Created:{" "}
                            {new Date(quiz.created_at).toLocaleDateString()} by{" "}
                            {quiz.created_by}
                          </p>
                        </div>
                        <button
                          className="btn-outline flex items-center gap-2"
                          onClick={() => handleViewDetails(quiz)}
                        >
                          <Edit className="h-4 w-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  ))} */}
                  {quizzes.length > 0 && (
                    <div
                      key={quizzes[0]._id}
                      className="p-4 border rounded-lg bg-card"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {quizzes[0].title}
                          </h3>
                          <p className="text-muted-foreground">
                            {quizzes[0].total_questions} questions
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            className="btn-outline flex items-center gap-2"
                            onClick={() => handleViewDetails(quizzes[0])}
                          >
                            <Edit className="h-4 w-4" />
                            View Details
                          </button>
                          <button
                            className="btn-outline flex items-center text-red-600 gap-2"
                            onClick={() => setConfirmDelete(quizzes[0]._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {confirmDelete && (
        <ConfirmModal
          message="Are you sure you want to delete this quiz? This action cannot be undone."
          btnName="Delete"
          onConfirm={() => handleDeleteQuiz(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
};

export default QuizManager;
