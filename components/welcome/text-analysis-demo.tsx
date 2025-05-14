"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { AnalysisResult } from "@/Model/cyberbulling.model";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { analysisService } from "@/services/analysis-api";

export function TextAnalysisDemo() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Mount effect for SSR compatibility
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sample texts for demonstration
  const sampleTexts = {
    harmful:
      "Turner did not withhold his disappointment. Turner called the court an abominable conclave of negro hating demons (with one exception) who issued another decree that colored men and women must be driven into Jim Crow cars whenever it suits the whim of any white community.",
    borderline:
      "If they r in Muslim country it doesn't mean they have to accept and support the terrorism..why u people can't digest the truth ? Radical Islamic terrorism have kept the world under threat..what the hell is being done by the radical Muslims terrorist these days to spread corona ?",
    safe: "For what it's worth, I don't believe that ISIS has 30,000 to 50,000 terrorists in Mosul.  Their inability to reinforce elsewhere says not.",
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Reset results when text changes
    setResult(null);
    setError(null);
  };

  const handleSampleText = (type: keyof typeof sampleTexts) => {
    setText(sampleTexts[type]);
    setResult(null);
    setError(null);
  };

  const analyzeContent = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    setResult(
      await analysisService
        .analyzeText(text)
        .then((res: AnalysisResult) => {
          setIsAnalyzing(false);
          return res;
        })
        .catch((err) => {
          setError(err);
          setIsAnalyzing(false);
          return null;
        })
    );
  };

  const getStatusBadge = () => {
    if (!result) return null;

    const variants = {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    switch (result.status) {
      case "clean":
        return (
          <motion.span
            initial="initial"
            animate="animate"
            variants={variants}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Safe
          </motion.span>
        );
      case "flagged":
        return (
          <motion.span
            initial="initial"
            animate="animate"
            variants={variants}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Flagged
          </motion.span>
        );
      case "blocked":
        return (
          <motion.span
            initial="initial"
            animate="animate"
            variants={variants}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Blocked
          </motion.span>
        );
      default:
        return null;
    }
  };

  const renderAnalysisResult = () => {
    if (!result) return null;

    let alertVariant: "default" | "destructive" | null = null;
    let icon = null;
    let title = "";
    let description = "";

    switch (result.status) {
      case "clean":
        alertVariant = "default";
        icon = <CheckCircle className="h-4 w-4 text-green-500" />;
        title = "Content is safe";
        description = "No cyberbullying detected in this text.";
        break;
      case "flagged":
        alertVariant = "default";
        icon = <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        title = "Content may contain cyberbullying";
        description =
          result.reason || "This content has been flagged for review.";
        break;
      case "blocked":
        alertVariant = "destructive";
        icon = <AlertCircle className="h-4 w-4" />;
        title = "Content blocked";
        description =
          result.reason ||
          "This content contains cyberbullying and has been blocked.";
        break;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 mt-4"
      >
        <Alert variant={alertVariant || "default"}>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            {icon}
            <AlertTitle>{title}</AlertTitle>
          </motion.div>
          <AlertDescription>{description}</AlertDescription>
        </Alert>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={cn(
            "rounded-md p-4 text-sm",
            "bg-gray-100 dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700",
            "transition-colors duration-200"
          )}
        >
          <h4 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            Analysis Details
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600 dark:text-gray-400">Status:</div>
            <div className="text-gray-900 dark:text-white">
              {getStatusBadge()}
            </div>

            <div className="text-gray-600 dark:text-gray-400">Confidence:</div>
            <div className="text-gray-900 dark:text-white">
              {(result.confidence * 100).toFixed(2)}%
            </div>

            {result.prediction && (
              <>
                <div className="text-gray-600 dark:text-gray-400">
                  Prediction:
                </div>
                <div className="text-gray-900 dark:text-white">
                  {result.prediction}
                </div>
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className={cn(
            "rounded-md p-4 text-sm",
            "bg-gray-100 dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700",
            "transition-colors duration-200"
          )}
        >
          <h4 className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            Technical Details
          </h4>
          <pre
            className={cn(
              "text-xs overflow-auto max-h-40 p-2 rounded",
              "bg-gray-200 dark:bg-gray-900",
              "text-gray-800 dark:text-gray-300"
            )}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </motion.div>
      </motion.div>
    );
  };

  if (!mounted) {
    return null; // Avoid rendering until client-side to prevent hydration issues
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap gap-2 mb-4"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSampleText("safe")}
            className={cn(
              "transition-colors duration-300",
              "bg-green-100 hover:bg-green-200 border-green-300 text-green-800",
              "dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:border-green-800 dark:text-green-400"
            )}
          >
            Try Safe Example
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSampleText("borderline")}
            className={cn(
              "transition-colors duration-300",
              "bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-800",
              "dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400"
            )}
          >
            Try Borderline Example
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSampleText("harmful")}
            className={cn(
              "transition-colors duration-300",
              "bg-red-100 hover:bg-red-200 border-red-300 text-red-800",
              "dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:border-red-800 dark:text-red-400"
            )}
          >
            Try Harmful Example
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Textarea
          placeholder="Enter text to analyze for cyberbullying content..."
          className={cn(
            "min-h-[120px] transition-colors duration-300",
            "bg-white border-gray-300 focus:border-blue-500",
            "dark:bg-gray-800 dark:border-gray-700 dark:focus:border-blue-400"
          )}
          value={text}
          onChange={handleTextChange}
        />
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={analyzeContent}
          disabled={isAnalyzing || !text.trim()}
          className={cn(
            "w-full transition-all duration-300",
            "bg-blue-600 hover:bg-blue-700",
            "dark:bg-blue-700 dark:hover:bg-blue-800"
          )}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Text"
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div
            key="analysis-result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {renderAnalysisResult()}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={cn(
          "mt-8 rounded-lg p-4",
          "bg-gray-100 dark:bg-gray-800/50",
          "border border-gray-200 dark:border-gray-700",
          "transition-colors duration-300"
        )}
      >
        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
          How Our Text Analysis Works
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            Text is preprocessed to normalize and tokenize the content
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            Our NLP model analyzes the text for harmful patterns and language
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            The model calculates a confidence score for cyberbullying detection
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            Content is classified as safe, flagged, or blocked based on severity
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            Detailed analysis results are provided with explanation
          </motion.li>
        </ol>
      </motion.div>
    </div>
  );
}
