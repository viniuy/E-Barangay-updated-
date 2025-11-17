import { useState } from "react";
import { allServices } from "../ServicesData";

interface Service {
  id: number;
  title: string;
  requirements: string[];
}

interface ServiceFormProps {
  service: string | null; 
  onNavigate: (view: 'dashboard' | 'services' | 'facilities' | 'application') => void;
}

export function ServiceForm({ service, onNavigate }: ServiceFormProps) {
  const serviceData: Service | undefined = allServices.find((s) => s.title === service);

  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  const handleChange = (req: string, value: string) => {
    setFormData((prev) => ({ ...prev, [req]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceData) {
      alert("Service not found");
      return;
    }

    console.log({
      serviceTitle: serviceData.title,
      ...formData,
    });

    alert("Application submitted!");
    onNavigate('services'); // go back after submit
  };

  if (!serviceData) {
    return <div>Service not found.</div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {serviceData.title} Application
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {serviceData.requirements.map((req, idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium text-gray-700">{req}</label>
            <input
              type="text"
              placeholder={`Enter ${req}`}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              onChange={(e) => handleChange(req, e.target.value)}
              required
            />
          </div>
        ))}

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => onNavigate('services')}
            className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300"
          >
            ← Back
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
        
      </form>
    </div>
  );
}
