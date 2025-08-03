"use client";

import { Card, CardHeader, CardBody, Chip, Code } from "@heroui/react";
import {
  Globe,
  Key,
  ImageIcon,
  MousePointer,
  Palette,
  CodeIcon,
} from "lucide-react";

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">
            SAM2 API Documentation
          </h1>
          <p className="text-lg text-slate-600">
            Image Segmentation API powered by Segment Anything Model 2
          </p>
        </div>

        {/* Base Configuration */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Base Configuration</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Base URL</h3>
              <Code className="text-sm w-full">
                {import.meta.env.VITE_APP_API_URL}
              </Code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Required Headers</h3>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm font-mono">
                <div>-H {"'Connection: keep-alive' \\"}</div>
                <div>-H {"'Content-Type: application/json' \\"}</div>
                <div>
                  -H {"'Authorization: Bearer {deployed_beam_cloud_token}' \\"}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Endpoint 1: Generate Masks */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              <h2 className="text-xl font-semibold">1. Generate Masks</h2>
            </div>
            <p className="text-slate-600">
              Generates segmentation masks for an input image
            </p>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center gap-2">
              <Chip color="danger" variant="solid">
                POST
              </Chip>
              <Code className="text-sm">/generate-masks</Code>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Request Body</h4>
              <p className="text-sm text-slate-600 mb-2">
                Supports both multipart/form-data and JSON formats:
              </p>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">JSON Format:</p>
                  <pre className="bg-slate-900 text-slate-100 p-3 rounded text-sm overflow-x-auto font-mono">
                    {`{
  "file": "base64-encoded-image-string",
  // (with optional \`data:image/...\` prefix)
  "session_id": "sessionId"
}`}
                  </pre>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Form-Data Format:</p>
                  <Code className="text-sm">Key: file (binary image file)</Code>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Response</h4>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded text-sm overflow-x-auto font-mono">
                {`{
  "width": 1024,
  "height": 768,
  "masks": [
    {
      "segmentation": "iVBORw0KGgoAAAANSUhEUgAA...",
      "area": 4500.25,
      "bbox": [10, 20, 100, 50],
      "point_coords": [[30, 40], [60, 70]]
    }
  ]
}`}
              </pre>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-900 mb-1">Notes:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • <Code className="text-xs">segmentation</Code>: Base64 PNG
                  string (white pixels = mask region)
                </li>
                <li>
                  • <Code className="text-xs">bbox</Code>: Bounding box format
                  [x, y, width, height]
                </li>
                <li>• Masks are sorted by area in descending order</li>
              </ul>
            </div>
          </CardBody>
        </Card>

        {/* Endpoint 2: Get Mask at Point */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <MousePointer className="h-5 w-5" />
              <h2 className="text-xl font-semibold">2. Get Mask at Point</h2>
            </div>
            <p className="text-slate-600">
              Returns mask indices at a specific (x, y) coordinate in the image
            </p>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center gap-2">
              <Chip color="danger" variant="solid">
                POST
              </Chip>
              <Code className="text-sm">/get-mask-at-point</Code>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Request Body</h4>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded text-sm overflow-x-auto font-mono">
                {`{
  "x": 100,           // X-coordinate (pixels)
  "y": 200,           // Y-coordinate (pixels)
  "session_id": "abc" // ID from /generate-masks
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Response</h4>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded text-sm overflow-x-auto font-mono">
                {`{
  "mask_indices": [0, 2] // Indices of masks at (x, y)
}`}
              </pre>
            </div>

            <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400">
              <h4 className="font-semibold text-amber-900 mb-1">
                Requirements:
              </h4>
              <p className="text-sm text-amber-800">
                Requires a valid <Code className="text-xs">session_id</Code>{" "}
                from the <Code className="text-xs">/generate-masks</Code>{" "}
                endpoint
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Endpoint 3: Apply Colors */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              <h2 className="text-xl font-semibold">
                3. Apply Colors to Masks
              </h2>
            </div>
            <p className="text-slate-600">
              Colors selected mask regions and returns the modified image
            </p>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center gap-2">
              <Chip color="danger" variant="solid">
                POST
              </Chip>
              <Code className="text-sm">/apply-colors</Code>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Request Body</h4>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded text-sm overflow-x-auto font-mono">
                {`{
  "session_id": "abc",      // ID from /generate-masks
  "mask_indices": [0, 1],   // Mask indices to color
  "color": [255, 0, 0]      // RGB color (e.g., red)
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Response</h4>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded text-sm overflow-x-auto font-mono">
                {`{
  "colored_image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  // Base64 result image
}`}
              </pre>
            </div>

            <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
              <h4 className="font-semibold text-green-900 mb-1">
                Color Format:
              </h4>
              <p className="text-sm text-green-800">
                RGB values should be provided as an array of three integers [R,
                G, B] where each value is between 0-255
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Usage Flow */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CodeIcon className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Typical Usage Flow</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium">Generate Masks</p>
                  <p className="text-sm text-slate-600">
                    Upload an image to get segmentation masks and a session ID
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium">Get Mask at Point (Optional)</p>
                  <p className="text-sm text-slate-600">
                    Find which masks contain a specific coordinate
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium">Apply Colors</p>
                  <p className="text-sm text-slate-600">
                    Color specific mask regions and get the final image
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Authentication */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Authentication</h2>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-slate-600 mb-3">
              All requests require a valid Beam Cloud token in the Authorization
              header:
            </p>
            <Code className="text-sm w-full">
              Authorization: Bearer {"<your-deployed-beam-cloud-token>"}
            </Code>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
