"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Check, Info, Pencil, Sparkles, User, Lightbulb, Target, ArrowUp } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useIdeaAccelerator } from "@/app/hooks"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/app/constants"
import { type Abi } from 'viem'
import { useAccount } from "wagmi"

// Define the structure for an idea type
interface IdeaType {
  title: string;
  icon: React.ElementType;
}

// Moved ideaTypes to the top-level scope for universal access
const ideaTypes: IdeaType[] = [
    { title: "User Persona", icon: User },
    { title: "Core Feature", icon: Lightbulb },
    { title: "Target Market", icon: Target },
    { title: "Problem Statement", icon: Info },
    { title: "Solution Outline", icon: Check },
    { title: "Marketing Angle", icon: Sparkles },
    { title: "Business Model", icon: Pencil },
    { title: "Key Metric", icon: Target },
    { title: "Competitor", icon: User },
];

type EvaluationButton = "opportunity" | "problem" | "feasibility" | "whyNow"

interface EvaluationState {
  loading: boolean
  score: number | null
  showPopup: boolean
  revealed: boolean
}

export default function Component() {
  const [showFixIssuesModal, setShowFixIssuesModal] = useState(false)
  const [ideaTitle, setIdeaTitle] = useState(
    "Renovation Payment Escrow - Financial Protection for Homeowners ($450B Market)",
  )
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  const initialDescription = `Renovation nightmares plague homeowners daily: contractors vanish with deposits, quality falls short of promises, and timelines stretch indefinitely.
Renovation Payment Escrow creates a secure financial buffer between homeowners and contractors, holding funds in escrow until predefined
milestones are verifiably completed. For $99 per project plus 1.5% of protected funds, homeowners gain immediate financial security while contractors
receive guaranteed payment upon completion of verified work.

The $450B home renovation market operates with almost no financial safeguards. Your target customers include first-time renovators facing contractor
uncertainty, real estate investors managing multiple projects, and property flippers working against tight timelines.

The platform delivers essential protection through:
- Secure milestone-based payment releases
- Photo/video verification of completed work
- Independent inspection integration
- Automated dispute resolution protocols
- Contractor performance tracking

You start with a simple web platform connected to Plaid for secure transfers, then expand into contractor vetting, material procurement guarantees,
and renovation financing. Growth comes through strategic partnerships with home inspection services, contractor referral networks, and real estate
investment communities.

As you scale, you build a valuable database of contractor performance metrics that becomes your defensible moat in the market. The business
generates predictable revenue while establishing itself as the trusted financial infrastructure for the entire renovation ecosystem.

Every anxious homeowner and reliable contractor needs this missing layer of security in an industry defined by uncertainty and risk.`

  const [ideaDescription, setIdeaDescription] = useState(initialDescription)
  const [isEditingDescription, setIsEditingDescription] = useState(false)

  const [evaluations, setEvaluations] = useState<Record<EvaluationButton, EvaluationState>>({
    opportunity: { loading: false, score: 9, showPopup: false, revealed: false },
    problem: { loading: false, score: 10, showPopup: false, revealed: false },
    feasibility: { loading: false, score: 6, showPopup: false, revealed: false },
    whyNow: { loading: false, score: 9, showPopup: false, revealed: false },
  })

  // State for the new inline ideation UI
  const [selectedIdeaType, setSelectedIdeaType] = useState<string | null>(null);
  const [ideationPrompt, setIdeationPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);


  const [selectedIssueType, setSelectedIssueType] = useState<EvaluationButton>("opportunity")
  const [selectedIssue, setSelectedIssue] = useState<string>("")
  const [userSuggestion, setUserSuggestion] = useState<string>("")

  const [showGrantRequest, setShowGrantRequest] = useState(false)
  const [grantAmount, setGrantAmount] = useState("")
  const [metadataURI, setMetadataURI] = useState("")

  const {
    useIsStaker,
    useRequestGrant,
  } = useIdeaAccelerator({
    contractAddress: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI as Abi,
  });

  const { data: isStaker } = useIsStaker();

  const {
    requestGrant,
    isPending,
    isConfirming,
    error
  } = useRequestGrant();

  const { isConnected } = useAccount()



  const closePopup = (type: EvaluationButton) => {
    setEvaluations((prev) => ({
      ...prev,
      [type]: { ...prev[type], showPopup: false },
    }))
  }

  const prosConsData = {
    opportunity: {
      pros: ["Large market potential", "Growing demand", "Limited competition"],
      cons: ["Market saturation risk", "High entry barriers", "Regulatory challenges"],
    },
    problem: {
      pros: ["Clear pain point", "Widespread issue", "Urgent need"],
      cons: ["Complex solution required", "User behavior change needed", "Alternative solutions exist"],
    },
    feasibility: {
      pros: ["Available technology", "Skilled team", "Reasonable timeline"],
      cons: ["Resource constraints", "Technical challenges", "Scalability concerns"],
    },
    whyNow: {
      pros: ["First mover advantage", "Unique approach", "Strong value proposition"],
      cons: ["Market not ready", "High development cost", "Uncertain ROI"],
    },
  }

  const issuesData = {
    opportunity: [
      {
        title: "Market saturation risk",
        description: "The market may become saturated with similar solutions, making it difficult to stand out and capture market share.",
        aiSuggestion: "Differentiate your approach by focusing on specific renovation niches or customer segments. Consider vertical specialization (e.g., kitchen renovations, historic home renovations) to create a stronger value proposition."
      },
      {
        title: "High entry barriers",
        description: "Entering this market requires significant trust and financial compliance hurdles to overcome.",
        aiSuggestion: "Consider partnerships with established financial institutions or renovation platforms to leverage their existing trust and compliance frameworks. Start with a limited geographic focus to establish credibility."
      },
      {
        title: "Regulatory challenges",
        description: "The escrow and financial services space faces complex regulations that vary by jurisdiction.",
        aiSuggestion: "Consult with legal experts early and build compliance into your product from the beginning. Consider starting in states with clearer regulatory frameworks for escrow services and expand gradually."
      }
    ],
    problem: [
      {
        title: "Complex solution required",
        description: "Creating an effective escrow system requires sophisticated financial, technical, and legal infrastructure.",
        aiSuggestion: "Start with a minimum viable product that addresses just one critical pain point, then expand features gradually. Focus on creating an incredibly simple user experience that hides complexity."
      },
      {
        title: "User behavior change needed",
        description: "Both homeowners and contractors need to change existing payment behaviors and workflows.",
        aiSuggestion: "Create strong incentives for both sides - offering contractor verification badges, dispute protection, and possibly even improved payment terms to encourage adoption."
      },
      {
        title: "Alternative solutions exist",
        description: "Users may already have workarounds or alternative ways to manage renovation payments.",
        aiSuggestion: "Clearly articulate your unique value proposition compared to existing alternatives like traditional escrow, direct payments, or lump sum contracts. Emphasize specific pain points you solve that others don't."
      }
    ],
    feasibility: [
      {
        title: "Resource constraints",
        description: "Building a compliant financial infrastructure requires significant development and legal resources.",
        aiSuggestion: "Consider utilizing existing escrow service APIs and payment processing platforms to reduce development load. Focus engineering effort on the unique parts of your solution."
      },
      {
        title: "Technical challenges",
        description: "Verification systems and secure payment infrastructure demand robust technical solutions.",
        aiSuggestion: "Leverage existing technologies like blockchain for transparent milestone tracking or AI for verification of completed work. Start with manual verification before investing in automation."
      },
      {
        title: "Scalability concerns",
        description: "The business model may face challenges scaling across diverse markets and project types.",
        aiSuggestion: "Design a modular platform from the beginning with standardized components that can adapt to different project types and regional requirements. Create APIs that allow for flexible integration with local services."
      }
    ],
    whyNow: [
      {
        title: "Market not ready",
        description: "The renovation market may not be ready to adopt new financial tools widely.",
        aiSuggestion: "Target early adopters first - tech-savvy property investors or renovation professionals who understand the value proposition. Use their success stories to drive broader market education."
      },
      {
        title: "High development cost",
        description: "Initial development and compliance costs may be substantial before generating revenue.",
        aiSuggestion: "Consider a phased approach with a manually-supported MVP to validate market interest before heavy investment. Partner with existing escrow services initially to reduce upfront costs."
      },
      {
        title: "Uncertain ROI",
        description: "The return on investment timeline may be longer than expected due to adoption challenges.",
        aiSuggestion: "Explore multiple revenue streams beyond transaction fees - such as contractor verification, materials procurement, or financing partnerships - to diversify income sources during growth."
      }
    ]
  }


  const handleGrantRequest = () => {
    if (!grantAmount || !metadataURI) return;
    requestGrant(metadataURI, grantAmount);
  };

  const isLoading = isPending || isConfirming;

  const handleGenerateClick = () => {
    if (!ideationPrompt.trim() && !selectedIdeaType) return;
    setIsGenerating(true);
    console.log(`Generating with prompt: ${ideationPrompt} and selected type: ${selectedIdeaType}`);
    // Simulate API call
    setTimeout(() => {
        setIsGenerating(false);
        // Optional: Clear inputs after generation
        // setIdeationPrompt("");
        // setSelectedIdeaType(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Main Idea Title */}
        <div className="text-left space-y-4">
          <div className="flex items-start gap-2">
            {isEditingTitle ? (
              <Textarea
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                className="text-4xl font-serif text-gray-900 leading-tight flex-grow bg-white"
                rows={2}
              />
            ) : (
              <h1 className="text-4xl font-serif text-gray-900 leading-tight">{ideaTitle}</h1>
            )}
            <Button variant="ghost" size="icon" onClick={() => setIsEditingTitle(!isEditingTitle)} className="flex-shrink-0">
              {isEditingTitle ? <Check className="w-6 h-6" /> : <Pencil className="w-5 h-5" />}
            </Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge className="bg-green-100 text-green-800 rounded-full px-3 py-1">🌍 Massive Market</Badge>
            <Badge className="bg-yellow-100 text-yellow-800 rounded-full px-3 py-1">⏰ Perfect Timing</Badge>
            <Badge className="bg-blue-100 text-blue-800 rounded-full px-3 py-1">⚡ Unfair Advantage</Badge>
            <Badge className="bg-gray-100 text-gray-600 rounded-full px-3 py-1">+15 More</Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Idea Description */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Idea Description</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingDescription(!isEditingDescription)}
                  className="flex-shrink-0"
                >
                  {isEditingDescription ? <Check className="w-6 h-6" /> : <Pencil className="w-5 h-5" />}
                </Button>
              </div>
              <div className="text-gray-700 leading-relaxed">
                {isEditingDescription ? (
                  <Textarea
                    value={ideaDescription}
                    onChange={(e) => setIdeaDescription(e.target.value)}
                    className="h-96 w-full bg-white"
                  />
                ) : (
                  ideaDescription.split("\n\n").map((paragraph, index) => {
                    if (paragraph.includes("\n- ")) {
                      const parts = paragraph.split("\n- ")
                      return (
                        <div key={index}>
                          <p className="mb-2">{parts[0]}</p>
                          <ul className="list-disc pl-8 mb-4 space-y-1">
                            {parts.slice(1).map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    }
                    return (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- NEW INLINE IDEATION SECTION --- */}
      <div className="max-w-4xl mx-auto space-y-6 mt-12">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-gray-900">Continue Ideating</h2>
          <p className="text-lg text-gray-600 mt-2">
            Select a category or describe your own idea to generate the next node.
          </p>
        </div>

        {/* Clickable Idea Type Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ideaTypes.map((idea) => (
                <button
                    key={idea.title}
                    onClick={() => setSelectedIdeaType(idea.title === selectedIdeaType ? null : idea.title)}
                    className={`p-4 bg-white border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        ${selectedIdeaType === idea.title ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`
                    }
                >
                    <idea.icon className={`w-7 h-7 mb-2 ${selectedIdeaType === idea.title ? 'text-blue-600' : 'text-blue-500'}`} />
                    <h3 className="text-sm font-semibold text-gray-800">{idea.title}</h3>
                </button>
            ))}
        </div>

        {/* Gemini-style Prompt Box */}
        <div className="relative">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-2 flex items-center w-full">
                <Textarea
                    value={ideationPrompt}
                    onChange={(e) => setIdeationPrompt(e.target.value)}
                    placeholder={selectedIdeaType ? `Refine the "${selectedIdeaType}"...` : "Or generate a new node from a prompt..."}
                    className="flex-grow bg-transparent border-none text-base text-gray-800 resize-none focus:outline-none focus:ring-0 h-12 p-2"
                    rows={1}
                />
                <Button
                    onClick={handleGenerateClick}
                    disabled={(!ideationPrompt.trim() && !selectedIdeaType) || isGenerating}
                    className="ml-2 rounded-lg w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex-shrink-0"
                >
                    {isGenerating ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        <ArrowUp className="w-5 h-5" />
                    )}
                </Button>
            </div>
        </div>
      </div>
      {/* --- END OF NEW SECTION --- */}


      {/* Evaluation and Other Modals (Unchanged) */}
      {Object.entries(evaluations).map(
        ([key, state]) =>
          state.showPopup && (
            <Dialog key={key} open={true} onOpenChange={() => closePopup(key as EvaluationButton)}>
              <DialogContent className="bg-white border border-gray-200">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between text-gray-900">
                    {key.charAt(0).toUpperCase() + key.slice(1)} - Score: {state.score}/10
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-3">Pros</h4>
                    <ul className="space-y-2 text-sm">
                      {prosConsData[key as EvaluationButton].pros.map((pro, index) => (
                        <li key={index} className="text-gray-600">
                          • {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-700 mb-3">Cons</h4>
                    <ul className="space-y-2 text-sm">
                      {prosConsData[key as EvaluationButton].cons.map((con, index) => (
                        <li key={index} className="text-gray-600">
                          • {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ),
      )}

      {/* Grant Request Modal */}
      <Dialog open={showGrantRequest} onOpenChange={setShowGrantRequest}>
        <DialogContent className="bg-white border border-gray-200 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Request Grant</DialogTitle>
          </DialogHeader>

          {!isConnected ? (
            <div className="py-6 space-y-4">
              <div className="text-center">
                <p className="text-gray-700 mb-2">Please connect your wallet from the main navigation</p>
                <p className="text-red-500 text-sm">You need to connect your wallet and stake at least 0.5 ETH to request grants</p>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={() => setShowGrantRequest(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : !isStaker ? (
            <div className="py-6 space-y-4">
              <div className="text-center">
                <p className="text-gray-700 mb-2">Your wallet is connected, but you need to stake first</p>
                <p className="text-red-500 text-sm">Stake at least 0.5 ETH to request grants</p>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={() => setShowGrantRequest(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Go to Staking Page
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Amount in ETH"
                  value={grantAmount}
                  onChange={(e) => setGrantAmount(e.target.value)}
                  min="0.1"
                  step="0.1"
                />
                <Textarea
                  placeholder="IPFS URI or metadata link containing project details"
                  value={metadataURI}
                  onChange={(e) => setMetadataURI(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {error && (
                <div className="text-sm text-red-500">
                  {error.message}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleGrantRequest}
                  disabled={isLoading || !grantAmount || !metadataURI}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Submitting..." : "Submit Grant Request"}
                </Button>
                <Button
                  onClick={() => setShowGrantRequest(false)}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fix Issues Modal (updated with tabs) */}
      <Dialog open={showFixIssuesModal} onOpenChange={setShowFixIssuesModal}>
        <DialogContent className="w-full max-w-full lg:max-w-6xl bg-white border border-gray-200 shadow-md rounded-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-6">Fix Issues</DialogTitle>
          </DialogHeader>

          <Tabs
            defaultValue="opportunity"
            orientation="vertical"
            onValueChange={(value: string) => {
              setSelectedIssueType(value as EvaluationButton)
              setSelectedIssue("")
              setUserSuggestion("")
            }}
          >
            <div className="flex flex-col lg:flex-row gap-8 mt-2">
              {/* Left Side - Main Tabs and Issue Selection */}
              <div className="flex flex-col space-y-6 w-full lg:w-1/3">
                {/* Main Category Tabs */}
                <div className=" border border-gray-200 rounded-xl p-5 shadow-sm">
                  <h3 className="font-medium text-gray-700 mb-3">Select Category:</h3>
                  <TabsList className="flex flex-col h-auto space-y-2 p-2 rounded-lg">
                    <TabsTrigger
                      value="opportunity"
                      className="justify-start px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                    >
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                      Opportunity Issues
                    </TabsTrigger>
                    <TabsTrigger
                      value="problem"
                      className="justify-start px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                    >
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                      Problem Issues
                    </TabsTrigger>
                    <TabsTrigger
                      value="feasibility"
                      className="justify-start px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                    >
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                      Feasibility Issues
                    </TabsTrigger>
                    <TabsTrigger
                      value="whyNow"
                      className="justify-start px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                    >
                      <div className="w-3 h-3 rounded-full bg-orange-500 mr-3"></div>
                      Why Now Issues
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Issues List */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-700 mb-3">Select an Issue:</h3>
                  <div className="space-y-2">
                    {issuesData[selectedIssueType]?.map((issue, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={`w-full justify-start h-auto py-3 px-4 text-left ${selectedIssue === issue.title
                            ? "bg-blue-50 border-blue-200 text-blue-800"
                            : "bg-white"
                          }`}
                        onClick={() => {
                          setSelectedIssue(issue.title)
                          setUserSuggestion("")
                        }}
                      >
                        {issue.title}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Issue Details and Suggestions */}
              <div className="w-full lg:w-2/3 flex flex-col space-y-6">
                {selectedIssue ? (
                  <>
                    <Card className="border border-gray-200 shadow-sm">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">{selectedIssue}</h3>
                        <p className="text-gray-700 mb-6">
                          {issuesData[selectedIssueType].find(issue => issue.title === selectedIssue)?.description}
                        </p>

                        {/* AI Suggestion */}
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 flex items-center mb-2">
                            <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2">AI</span>
                            AI Suggestion
                          </h4>
                          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                            <p className="text-gray-700">
                              {issuesData[selectedIssueType].find(issue => issue.title === selectedIssue)?.aiSuggestion}
                            </p>
                          </div>
                        </div>

                        {/* User Suggestion */}
                        <div>
                          <h4 className="font-medium text-gray-900 flex items-center mb-2">
                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2">You</span>
                            Your Solution
                          </h4>
                          <Textarea
                            placeholder="Enter your solution to this issue..."
                            value={userSuggestion}
                            onChange={(e) => setUserSuggestion(e.target.value)}
                            className="min-h-[120px]"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Fix Button */}
                    <div className="flex justify-end">
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 text-base font-semibold rounded-lg"
                        disabled={!userSuggestion}
                      >
                        Fix This Issue
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-500 text-center">Select an issue from the left to see details and add your solution</p>
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}