import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Pencil, Sparkles } from "lucide-react";

type IdeateAttribute =
  | "userFlow"
  | "usability"
  | "marketing"
  | "need"
  | "monetization"
  | "scalability"
  | "technicalComplexity"
  | "differentiation"
  | "adoptionBarriers";

interface IdeationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate: (results: string) => void;
}

const IdeationModal: React.FC<IdeationModalProps> = ({
  isOpen,
  onClose,
  onValidate,
}) => {
  const [selectedIdeateAttribute, setSelectedIdeateAttribute] =
    useState<IdeateAttribute>("userFlow");
  const [results, setResults] = useState("");
  const [isEditingResults, setIsEditingResults] = useState(false);
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Get attribute description based on selection
  const getAttributeDescription = (attribute: IdeateAttribute): string => {
    switch (attribute) {
      case "userFlow":
        return "Analyze the user journey and interaction flow";
      case "usability":
        return "Evaluate ease of use and user experience";
      case "marketing":
        return "Assess marketing strategies and channels";
      case "need":
        return "Validate market need and demand";
      case "monetization":
        return "Explore revenue models and how the idea will generate income";
      case "scalability":
        return "Assess how well the idea can grow and handle increased demand";
      case "technicalComplexity":
        return "Evaluate the technical challenges and feasibility of building the idea";
      case "differentiation":
        return "Identify what makes this idea unique compared to competitors";
      case "adoptionBarriers":
        return "Consider obstacles that could prevent users from adopting the idea";
      default:
        return "";
    }
  };

  const handleValidate = () => {
    onValidate(results);
    onClose();
  };

  const handleGenerateFromPrompt = () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation (in a real app, this would be an API call)
    setTimeout(() => {
      setResults(
        `AI-generated insights for ${selectedIdeateAttribute} based on prompt: "${prompt}"\n\nThis would contain detailed analysis of the selected attribute with relevant suggestions and considerations.`
      );
      setIsGenerating(false);
      setShowPromptInput(false);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-full lg:max-w-6xl bg-white border border-gray-200 shadow-md rounded-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-6">
            Ideation Workshop
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-10 items-stretch mt-2">
          {/* Left Side - Attribute Selection and Description */}
          <div className="flex flex-col flex-1 max-w-md bg-white rounded-xl border border-gray-200 p-4 gap-4 shadow-sm">
            {/* Attribute Grid - displayed in a 3x3 grid to avoid scrolling */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "userFlow" as IdeateAttribute, label: "User Flow" },
                { key: "usability" as IdeateAttribute, label: "Usability" },
                { key: "marketing" as IdeateAttribute, label: "Marketing" },
                { key: "need" as IdeateAttribute, label: "Need" },
                { key: "monetization" as IdeateAttribute, label: "Monetization" },
                { key: "scalability" as IdeateAttribute, label: "Scalability" },
                {
                  key: "technicalComplexity" as IdeateAttribute,
                  label: "Technical",
                },
                {
                  key: "differentiation" as IdeateAttribute,
                  label: "Differentiation",
                },
                {
                  key: "adoptionBarriers" as IdeateAttribute,
                  label: "Adoption",
                },
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  variant={selectedIdeateAttribute === key ? "default" : "outline"}
                  onClick={() => setSelectedIdeateAttribute(key)}
                  className={`h-12 text-xs sm:text-sm font-medium border ${
                    selectedIdeateAttribute === key
                      ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-800"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </Button>
              ))}
            </div>

            {/* Description Box */}
            <div className="bg-gray-50 rounded-lg border border-gray-100 p-3 shadow-sm min-h-[60px] flex items-center">
              <span className="text-sm text-gray-700">
                {getAttributeDescription(selectedIdeateAttribute)}
              </span>
            </div>




            {/* Generate Options */}
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setShowPromptInput(!showPromptInput);
                  if (!showPromptInput) setPrompt("");
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate via Prompt</span>
              </Button>

              {/* Prompt Input - appears directly below the button when showPromptInput is true */}
              {showPromptInput && (
                <div className="space-y-3 bg-purple-50 p-3 rounded-lg border border-purple-100">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={`Enter a prompt for ${selectedIdeateAttribute}...`}
                    className="min-h-[100px] border-purple-200 focus:border-purple-300"
                  />
                  <Button
                    onClick={handleGenerateFromPrompt}
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      "Generate Content"
                    )}
                  </Button>
                </div>
              )}

              
            </div>
          </div>

          {/* Right Side - Results Box */}
          <div className="flex flex-col flex-[2] items-center justify-start gap-6">
            <div className="w-full bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col h-[350px]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-xl text-gray-900">Results</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingResults(!isEditingResults)}
                  className="flex-shrink-0"
                >
                  {isEditingResults ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <Pencil className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <div className="flex-1 flex items-start w-full">
                {isEditingResults ? (
                  <Textarea
                    placeholder="Enter your results here..."
                    value={results}
                    onChange={(e) => setResults(e.target.value)}
                    className="border-gray-200 focus:border-gray-400 h-full w-full resize-none text-base"
                  />
                ) : (
                  <div className="text-base text-gray-700 leading-relaxed w-full whitespace-pre-wrap overflow-auto">
                    {results || (
                      <span className="text-gray-400 italic">
                        Results will appear here. Generate content or start manual ideation.
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center w-full">
              <Button
                onClick={handleValidate}
                disabled={!results.trim()}
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-2 text-base font-semibold rounded-lg disabled:opacity-50"
              >
                Validate
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IdeationModal; 