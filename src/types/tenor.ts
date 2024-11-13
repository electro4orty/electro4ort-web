export interface TenorResponseObject {
  content_description: string;
  content_description_source: string;
  created: number;
  flags: string[];
  hasaudio: boolean;
  id: string;
  itemurl: string;
  media_formats: {
    loopedmp4: {
      dims: [number, number];
      duration: number;
      preview: string;
      size: number;
      url: string;
    };
  };
  tags: string[];
  title: string;
  url: string;
}

export interface TenorResponse {
  next: string;
  results: TenorResponseObject[];
}
