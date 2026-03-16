export interface ATSImprovement {
    issue: string;
    description: string;
    suggestion: string;
}

export interface ATSCategoryScore {
    score: number;
    label: string;
    feedback: string;
}

export interface ATSSectionsDetected {
    contact_info: boolean;
    education: boolean;
    experience: boolean;
    skills: boolean;
    summary: boolean;
    projects: boolean;
    certifications: boolean;
}

export interface ATSScanResult {
    overall_score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    summary: string;
    category_scores: {
        ats_compatibility: ATSCategoryScore;
        content_quality: ATSCategoryScore;
        formatting: ATSCategoryScore;
        completeness: ATSCategoryScore;
        professional_language: ATSCategoryScore;
    };
    sections_detected: ATSSectionsDetected;
    strengths: string[];
    improvements: ATSImprovement[];
    keywords_found: string[];
    missing_keywords: string[];
    ats_tips: string[];
}

export interface ATSMatchedKeyword {
    keyword: string;
    importance: 'High' | 'Medium' | 'Low';
    found_in: string[];
}

export interface ATSMissingKeyword {
    keyword: string;
    importance: 'High' | 'Medium' | 'Low';
    context: string;
}

export interface ATSJobMatchKeywordAnalysis {
    matched_keywords: ATSMatchedKeyword[];
    missing_keywords: ATSMissingKeyword[];
    match_percentage: number;
}

export interface ATSJobMatchSkillsAnalysis {
    matched_skills: string[];
    missing_required_skills: string[];
    missing_preferred_skills: string[];
    bonus_skills: string[];
}

export interface ATSJobMatchExperienceAnalysis {
    years_required: number | string;
    years_candidate_has: number | string;
    experience_match: boolean;
    relevant_experience_summary: string;
    experience_gaps: string[];
}

export interface ATSJobMatchEducationAnalysis {
    required: string;
    candidate_has: string;
    education_match: boolean;
}

export interface ATSJobMatchPositive {
    title: string;
    description: string;
}

export interface ATSJobMatchNegative {
    title: string;
    severity: 'Critical' | 'Moderate' | 'Minor';
    description: string;
    how_to_address: string;
}

export interface ATSTailoringSuggestion {
    section: string;
    current_issue: string;
    suggested_action: string;
}

export interface ATSJobMatchResult {
    match_score: number;
    match_label: string;
    hiring_likelihood: string;
    executive_summary: string;
    keyword_analysis: ATSJobMatchKeywordAnalysis;
    skills_analysis: ATSJobMatchSkillsAnalysis;
    experience_analysis: ATSJobMatchExperienceAnalysis;
    education_analysis: ATSJobMatchEducationAnalysis;
    positives: ATSJobMatchPositive[];
    negatives: ATSJobMatchNegative[];
    resume_tailoring_suggestions: ATSTailoringSuggestion[];
    interview_talking_points: string[];
    overall_recommendation: string;
}

export interface ATSScan {
    id: string;
    user_id: string;
    scan_type: 'resume_only' | 'job_match';
    resume_filename: string;
    result: ATSScanResult | ATSJobMatchResult;
    overall_score: number;
    match_score: number | null;
    created_at: string;
    updated_at?: string;
}

export type ATSUploadState = 'idle' | 'uploading' | 'scanning' | 'success' | 'error';

export interface ATSScanRequest {
    resumeFile: File;
}

export interface ATSJobMatchRequest {
    resumeFile: File;
    jobDescription: string;
}
