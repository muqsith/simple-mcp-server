import { FastMCP } from 'fastmcp';
import { z } from 'zod'; // Or any validation library that supports Standard Schema

const server = new FastMCP({
  name: 'Weather Server',
  version: '1.0.0',
});

server.addTool({
  name: 'add',
  description: 'Add two numbers',
  parameters: z.object({
    a: z.number(),
    b: z.number(),
  }),
  execute: async (args) => {
    return String(args.a + args.b);
  },
});

server.addTool({
  name: 'get_current_weather',
  description: 'Get current weather for a location',
  parameters: z.object({
    city: z.string().describe('City name'),
  }),
  execute: async (args) => {
    const endpoint = 'https://wttr.in';
    const response = await fetch(`${endpoint}/${args.city}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }
    const weatherData = await response.text();
    return weatherData;
  },
});

server
  .start({
    transportType: 'httpStream',
    httpStream: {
      port: 8053,
    },
  })
  .then(() => {
    console.log('FastMCP server is running on port http://localhost:8053/sse');
  })
  .catch((error) => {
    console.error('Error starting FastMCP server:', error);
  });
