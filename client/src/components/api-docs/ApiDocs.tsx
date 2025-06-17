import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";

const ApiDocs: React.FC = () => {
  // Sample Postman collection data as JSON string
  const postmanCollection = JSON.stringify({
    "info": {
      "name": "PrinterHub API",
      "description": "API for managing printers and print jobs with QZ Tray integration",
      "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "variable": [
      {
        "key": "base_url",
        "value": "https://your-domain.com",
        "type": "string"
      },
      {
        "key": "api_key",
        "value": "YOUR_API_KEY",
        "type": "string"
      },
      {
        "key": "printerId",
        "value": "14",
        "type": "string"
      }
    ],
    "item": [
      {
        "name": "Authentication",
        "item": [
          {
            "name": "Login",
            "request": {
              "method": "POST",
              "header": [
                {
                  "key": "Content-Type",
                  "value": "application/json",
                  "type": "text"
                }
              ],
              "body": {
                "mode": "raw",
                "raw": "{\n  \"username\": \"admin\",\n  \"password\": \"admin123\"\n}"
              },
              "url": {
                "raw": "{{base_url}}/api/login",
                "host": ["{{base_url}}"],
                "path": ["api", "login"]
              }
            }
          }
        ]
      },
      {
        "name": "Print Jobs",
        "item": [
          {
            "name": "Print PDF (Simple)",
            "request": {
              "method": "POST",
              "header": [
                {
                  "key": "Authorization",
                  "value": "Bearer {{api_key}}",
                  "type": "text"
                },
                {
                  "key": "Content-Type",
                  "value": "application/json",
                  "type": "text"
                }
              ],
              "body": {
                "mode": "raw",
                "raw": "{\n  \"printerId\": \"printer123\",\n  \"documentUrl\": \"https://example.com/path/to/document.pdf\"\n}"
              },
              "url": {
                "raw": "{{base_url}}/api/print-simple",
                "host": ["{{base_url}}"],
                "path": ["api", "print-simple"]
              }
            }
          },
          {
            "name": "Print PDF (Advanced)",
            "request": {
              "method": "POST",
              "header": [
                {
                  "key": "Authorization",
                  "value": "Bearer {{api_key}}",
                  "type": "text"
                },
                {
                  "key": "Content-Type",
                  "value": "application/json",
                  "type": "text"
                }
              ],
              "body": {
                "mode": "raw",
                "raw": "{\n  \"printerId\": \"printer123\",\n  \"documentUrl\": \"https://example.com/path/to/document.pdf\",\n  \"options\": {\n    \"copies\": 1,\n    \"duplex\": false,\n    \"orientation\": \"portrait\"\n  }\n}"
              },
              "url": {
                "raw": "{{base_url}}/api/print",
                "host": ["{{base_url}}"],
                "path": ["api", "print"]
              }
            }
          },
          {
            "name": "Print PDF (Numeric ID)",
            "request": {
              "method": "POST",
              "header": [
                {
                  "key": "Authorization",
                  "value": "Bearer {{api_key}}",
                  "type": "text"
                },
                {
                  "key": "Content-Type",
                  "value": "application/json",
                  "type": "text"
                }
              ],
              "body": {
                "mode": "raw",
                "raw": "{\n  \"printerId\": {{printerId}},\n  \"documentUrl\": \"https://www.plasforte.com.ar/wp-content/uploads/2018/01/muestra-1.pdf\",\n  \"documentName\": \"Documento de prueba\",\n  \"copies\": 1,\n  \"duplex\": false,\n  \"orientation\": \"portrait\"\n}"
              },
              "url": {
                "raw": "{{base_url}}/api/print-id",
                "host": ["{{base_url}}"],
                "path": ["api", "print-id"]
              }
            }
          },
          {
            "name": "Get Print Jobs",
            "request": {
              "method": "GET",
              "header": [
                {
                  "key": "Authorization",
                  "value": "Bearer {{api_key}}",
                  "type": "text"
                }
              ],
              "url": {
                "raw": "{{base_url}}/api/print-jobs",
                "host": ["{{base_url}}"],
                "path": ["api", "print-jobs"]
              }
            }
          }
        ]
      },
      {
        "name": "Printers",
        "item": [
          {
            "name": "Get All Printers",
            "request": {
              "method": "GET",
              "header": [
                {
                  "key": "Authorization",
                  "value": "Bearer {{api_key}}",
                  "type": "text"
                }
              ],
              "url": {
                "raw": "{{base_url}}/api/printers",
                "host": ["{{base_url}}"],
                "path": ["api", "printers"]
              }
            }
          },
          {
            "name": "Get Printer Status",
            "request": {
              "method": "GET",
              "header": [
                {
                  "key": "Authorization",
                  "value": "Bearer {{api_key}}",
                  "type": "text"
                }
              ],
              "url": {
                "raw": "{{base_url}}/api/printers/{{printerId}}/status",
                "host": ["{{base_url}}"],
                "path": ["api", "printers", "{{printerId}}", "status"]
              }
            }
          },
          {
            "name": "Sync Printers (QZ Tray)",
            "request": {
              "method": "POST",
              "header": [
                {
                  "key": "Authorization",
                  "value": "Bearer {{api_key}}",
                  "type": "text"
                },
                {
                  "key": "Content-Type",
                  "value": "application/json",
                  "type": "text"
                }
              ],
              "body": {
                "mode": "raw",
                "raw": "[\n  {\n    \"name\": \"Microsoft Print to PDF\",\n    \"uniqueId\": \"microsoft_print_to_pdf_14\",\n    \"location\": \"Local\",\n    \"description\": \"Microsoft Print to PDF\"\n  }\n]"
              },
              "url": {
                "raw": "{{base_url}}/api/printers/sync",
                "host": ["{{base_url}}"],
                "path": ["api", "printers", "sync"]
              }
            }
          }
        ]
      },
      {
        "name": "Users",
        "item": [
          {
            "name": "Get All Users (Admin only)",
            "request": {
              "method": "GET",
              "header": [
                {
                  "key": "Authorization",
                  "value": "Bearer {{api_key}}",
                  "type": "text"
                }
              ],
              "url": {
                "raw": "{{base_url}}/api/users",
                "host": ["{{base_url}}"],
                "path": ["api", "users"]
              }
            }
          },
          {
            "name": "Get My API Key",
            "request": {
              "method": "GET",
              "header": [
                {
                  "key": "Authorization",
                  "value": "Bearer {{api_key}}",
                  "type": "text"
                }
              ],
              "url": {
                "raw": "{{base_url}}/api/users/me/apikey",
                "host": ["{{base_url}}"],
                "path": ["api", "users", "me", "apikey"]
              }
            }
          },
          {
            "name": "Rotate API Key",
            "request": {
              "method": "POST",
              "header": [
                {
                  "key": "Authorization",
                  "value": "Bearer {{api_key}}",
                  "type": "text"
                },
                {
                  "key": "Content-Type",
                  "value": "application/json",
                  "type": "text"
                }
              ],
              "url": {
                "raw": "{{base_url}}/api/users/me/apikey/rotate",
                "host": ["{{base_url}}"],
                "path": ["api", "users", "me", "apikey", "rotate"]
              }
            }
          }
        ]
      },
      {
        "name": "Dashboard",
        "item": [
          {
            "name": "Get Statistics",
            "request": {
              "method": "GET",
              "header": [
                {
                  "key": "Authorization",
                  "value": "Bearer {{api_key}}",
                  "type": "text"
                }
              ],
              "url": {
                "raw": "{{base_url}}/api/stats",
                "host": ["{{base_url}}"],
                "path": ["api", "stats"]
              }
            }
          },
          {
            "name": "Get Recent Activity",
            "request": {
              "method": "GET",
              "header": [
                {
                  "key": "Authorization",
                  "value": "Bearer {{api_key}}",
                  "type": "text"
                }
              ],
              "url": {
                "raw": "{{base_url}}/api/recent-activity",
                "host": ["{{base_url}}"],
                "path": ["api", "recent-activity"]
              }
            }
          }
        ]
      }
    ]
  }, null, 2);

  const downloadPostmanCollection = () => {
    const blob = new Blob([postmanCollection], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "PrinterHub_API.postman_collection.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900">API Documentation</h2>
      <p className="mt-1 text-sm text-gray-500">
        Complete REST API documentation for PrinterHub with QZ Tray integration.
      </p>

      {/* Authentication Section */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            🔐 Authentication
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            All API requests require authentication except login.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">POST /api/login</h4>
          <div className="mt-2 bg-gray-50 p-4 rounded-md">
            <pre className="text-xs overflow-auto text-gray-700">
{`{
  "username": "admin",
  "password": "admin123"
}`}
            </pre>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700">Response</h4>
            <div className="mt-2 bg-gray-50 p-4 rounded-md">
              <pre className="text-xs overflow-auto text-gray-700">
{`{
  "apiKey": "f91f59875cc7ee7f4b39238763279875faf525192a756412a309e672204aae69",
  "username": "admin",
  "name": "Admin User"
}`}
              </pre>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700">Using the API Key</h4>
            <p className="mt-1 text-sm text-gray-500">
              Include the API key in all subsequent requests:
            </p>
            <div className="mt-2 bg-gray-50 p-4 rounded-md">
              <pre className="text-xs overflow-auto text-gray-700">
                Authorization: Bearer f91f59875cc7ee7f4b39238763279875faf525192a756412a309e672204aae69
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Print Jobs Section */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            🖨️ Print Jobs
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Send documents to printers and manage print jobs.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="space-y-6">
            {/* Simple Print */}
            <div>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  POST
                </span>
                <Input
                  className="flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  value="/api/print-simple"
                  readOnly
                />
              </div>
              <div className="mt-2 bg-gray-50 p-4 rounded-md">
                <pre className="text-xs overflow-auto text-gray-700">
{`{
  "printerId": "printer_unique_id",
  "documentUrl": "https://example.com/document.pdf"
}`}
                </pre>
              </div>
            </div>

            {/* Advanced Print */}
            <div>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  POST
                </span>
                <Input
                  className="flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  value="/api/print"
                  readOnly
                />
              </div>
              <div className="mt-2 bg-gray-50 p-4 rounded-md">
                <pre className="text-xs overflow-auto text-gray-700">
{`{
  "printerId": "printer_unique_id",
  "documentUrl": "https://example.com/document.pdf",
  "options": {
    "copies": 1,
    "duplex": false,
    "orientation": "portrait"
  }
}`}
                </pre>
              </div>
            </div>

            {/* Numeric ID Print */}
            <div>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-green-50 text-green-700 text-sm font-medium">
                  POST
                </span>
                <Input
                  className="flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  value="/api/print-id"
                  readOnly
                />
              </div>
              <p className="mt-1 text-sm text-green-600 font-medium">⭐ Recomendado para Postman</p>
              <div className="mt-2 bg-gray-50 p-4 rounded-md">
                <pre className="text-xs overflow-auto text-gray-700">
{`{
  "printerId": 14,
  "documentUrl": "https://www.plasforte.com.ar/wp-content/uploads/2018/01/muestra-1.pdf",
  "documentName": "Documento de prueba",
  "copies": 1,
  "duplex": false,
  "orientation": "portrait"
}`}
                </pre>
              </div>
              <div className="mt-2 bg-green-50 p-3 rounded-md">
                <p className="text-sm text-green-700 font-medium">💡 Notas importantes:</p>
                <ul className="mt-1 text-sm text-green-600 list-disc pl-4 space-y-1">
                  <li>El <code>printerId</code> debe ser un número (sin comillas)</li>
                  <li>Usa el ID numérico que aparece en la lista de impresoras</li>
                  <li>Incluye <code>Content-Type: application/json</code> en los headers</li>
                </ul>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">Response</h4>
                <div className="mt-2 bg-gray-50 p-4 rounded-md">
                  <pre className="text-xs overflow-auto text-gray-700">
{`{
  "success": true,
  "jobId": 5,
  "status": "pending",
  "printer": {
    "id": 14,
    "name": "Microsoft Print to PDF",
    "status": "online"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Get Print Jobs */}
            <div>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-blue-50 text-blue-700 text-sm">
                  GET
                </span>
                <Input
                  className="flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  value="/api/print-jobs"
                  readOnly
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Obtiene todos los trabajos de impresión del usuario autenticado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Printers Section */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            🖨️ Printers Management
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage printers and check their status.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="space-y-4">
            {/* Get All Printers */}
            <div>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-blue-50 text-blue-700 text-sm">
                  GET
                </span>
                <Input
                  className="flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  value="/api/printers"
                  readOnly
                />
              </div>
              <div className="mt-2 bg-gray-50 p-4 rounded-md">
                <pre className="text-xs overflow-auto text-gray-700">
{`[
  {
    "id": 14,
    "name": "Microsoft Print to PDF",
    "uniqueId": "microsoft_print_to_pdf_14",
    "location": "Local",
    "description": "Microsoft Print to PDF",
    "status": "online",
    "lastPrintTime": null
  }
]`}
                </pre>
              </div>
            </div>

            {/* Get Printer Status */}
            <div>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-blue-50 text-blue-700 text-sm">
                  GET
                </span>
                <Input
                  className="flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  value="/api/printers/{id}/status"
                  readOnly
                />
              </div>
              <div className="mt-2 bg-gray-50 p-4 rounded-md">
                <pre className="text-xs overflow-auto text-gray-700">
{`{
  "printerId": 14,
  "uniqueId": "microsoft_print_to_pdf_14",
  "status": "online",
  "qzTrayConnected": true,
  "lastActivity": null,
  "pendingJobs": 0
}`}
                </pre>
              </div>
            </div>

            {/* Sync Printers */}
            <div>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-purple-50 text-purple-700 text-sm">
                  POST
                </span>
                <Input
                  className="flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  value="/api/printers/sync"
                  readOnly
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Usado internamente por QZ Tray para sincronizar impresoras</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Section */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            📊 Dashboard & Statistics
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Get system statistics and recent activity.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="space-y-4">
            {/* Statistics */}
            <div>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-blue-50 text-blue-700 text-sm">
                  GET
                </span>
                <Input
                  className="flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  value="/api/stats"
                  readOnly
                />
              </div>
              <div className="mt-2 bg-gray-50 p-4 rounded-md">
                <pre className="text-xs overflow-auto text-gray-700">
{`{
  "activePrinters": 1,
  "jobsToday": 5,
  "pendingJobs": 0,
  "activeUsers": 1,
  "totalPrinters": 1,
  "totalUsers": 2,
  "totalJobs": 5
}`}
                </pre>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-blue-50 text-blue-700 text-sm">
                  GET
                </span>
                <Input
                  className="flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  value="/api/recent-activity"
                  readOnly
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Obtiene los últimos 10 trabajos de impresión con detalles</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            👥 User Management
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage users and API keys (admin access required for most operations).
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="space-y-4">
            {/* Get Users */}
            <div>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-blue-50 text-blue-700 text-sm">
                  GET
                </span>
                <Input
                  className="flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  value="/api/users"
                  readOnly
                />
              </div>
              <p className="mt-1 text-sm text-red-600">🔒 Requiere permisos de administrador</p>
            </div>

            {/* Get My API Key */}
            <div>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-blue-50 text-blue-700 text-sm">
                  GET
                </span>
                <Input
                  className="flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  value="/api/users/me/apikey"
                  readOnly
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Obtiene la API key del usuario autenticado</p>
            </div>

            {/* Rotate API Key */}
            <div>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-yellow-50 text-yellow-700 text-sm">
                  POST
                </span>
                <Input
                  className="flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  value="/api/users/me/apikey/rotate"
                  readOnly
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">Genera una nueva API key para el usuario autenticado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Codes Section */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            ⚠️ Error Codes & Troubleshooting
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-red-800">400 Bad Request</h4>
              <p className="text-sm text-red-600">Datos de entrada inválidos o faltantes</p>
            </div>
            <div className="bg-red-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-red-800">401 Unauthorized</h4>
              <p className="text-sm text-red-600">API key inválida o faltante</p>
            </div>
            <div className="bg-red-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-red-800">403 Forbidden</h4>
              <p className="text-sm text-red-600">Permisos insuficientes (se requiere admin)</p>
            </div>
            <div className="bg-red-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-red-800">404 Not Found</h4>
              <p className="text-sm text-red-600">Recurso no encontrado (impresora, usuario, etc.)</p>
            </div>
          </div>

          <div className="mt-6 bg-amber-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-amber-800">💡 Tips para Postman</h4>
            <ul className="mt-2 text-sm text-amber-700 space-y-1 list-disc pl-4">
              <li>Siempre incluye <code>Content-Type: application/json</code></li>
              <li>El header Authorization debe tener el formato exacto: <code>Bearer tu-api-key</code></li>
              <li>Para printerId numérico, usa números sin comillas: <code>"printerId": 14</code></li>
              <li>Si recibes HTML en lugar de JSON, verifica los headers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            📥 Postman Collection
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Download the complete Postman collection with all endpoints configured.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <Button
            onClick={downloadPostmanCollection}
            className="inline-flex items-center"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Complete Postman Collection
          </Button>
          <p className="mt-2 text-sm text-gray-500">
            La colección incluye variables para base_url, api_key y printerId. 
            Configúralas en Postman para usar todos los endpoints fácilmente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;