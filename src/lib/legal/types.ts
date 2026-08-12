export type LegalSubsection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  trailingParagraphs?: string[];
};

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  trailingParagraphs?: string[];
  subsections?: LegalSubsection[];
};

export type LegalDocument = {
  title: string;
  lastUpdated: string;
  intro: string[];
  sections: LegalSection[];
  closing?: {
    heading: string;
    paragraphs: string[];
  };
};
