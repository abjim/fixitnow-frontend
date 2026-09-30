// backend does not store service images, so each category gets a fixed photo
const byCategory: Record<string, string> = {
  plumbing: 'photo-1504328345606-18bbc8c9d7d1',
  electrical: 'photo-1621905251189-08b45d6a269e',
  cleaning: 'photo-1628177142898-93e36e4e3a50',
  painting: 'photo-1618220179428-22790b461013',
  'ac-repair': 'photo-1621905252507-b35492cc74b4',
  'appliance-repair': 'photo-1556911220-bff31c812dba',
};

const fallback = 'photo-1581244277943-fe4a9c777189';

export function categoryImage(slug: string, width = 600, height = 400) {
  const id = byCategory[slug] ?? fallback;
  return `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&q=75`;
}

export const heroImage =
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&h=1100&fit=crop&q=80';
