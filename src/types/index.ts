export type Provider = 'anthropic' | 'google';

export interface GeneratedComponent {
  id: string;
  prompt: string;
  code: string;
  createdAt: Date;
  provider: Provider;
}

export interface ComponentHistory {
  components: GeneratedComponent[];
  totalCount: number;
}
