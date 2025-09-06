'use server';
import { knowledge } from '../knowledge';

export async function getWebsiteInfo(query: string): Promise<string> {
  const queryWords = query.toLowerCase().split(/\s+/);
  const matchingArticles = knowledge.filter(item => {
    const content = (item.title + ' ' + item.content).toLowerCase();
    return queryWords.some(word => content.includes(word));
  });
  if (matchingArticles.length === 0) {
    return "No specific information found on that topic.";
  }
  return matchingArticles
    .map(item => `Title: ${item.title}\nContent: ${item.content}`)
    .join('\n\n---\n\n');
}