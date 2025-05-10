'use client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useState } from 'react'
import { ChevronRight, PlusCircle, Thermometer, AlertCircle } from 'lucide-react'

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('')
  const [predictions, setPredictions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userDetails, setUserDetails] = useState({
    disease: '',
    age: '',
    gender: 'prefer-not-to-say',
    duration: '',
    severity: 'moderate'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms: symptoms
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data.success) {
        setPredictions(data.predictions);
        setUserDetails(prev => ({
          ...prev,
          disease: data.predictions[0].disease
        }));
      } else {
        throw new Error(data.error || 'Failed to analyze symptoms');
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze symptoms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleDetailChange = (field, value) => {
    setUserDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
            <div className="flex items-center space-x-3">
              <Thermometer className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl font-bold">Symptom Checker</CardTitle>
                <p className="text-blue-100">Get personalized health insights</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="symptoms" className="flex items-center space-x-2">
                  <PlusCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-lg font-medium">Describe your symptoms</span>
                </Label>
                <Textarea
                  id="symptoms"
                  rows={4}
                  className="min-h-[120px] text-base"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g., throbbing headache on the left side, sensitivity to light, nausea..."
                />
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Analyze Symptoms <ChevronRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </Button>
            </form>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {predictions.length > 0 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Possible Conditions
                  </h2>
                  <p className="text-gray-600">Select the condition that best matches your symptoms</p>
                </div>
                
                <div className="grid gap-3">
                  {predictions.map((prediction, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        userDetails.disease === prediction.disease 
                          ? 'border-blue-500 bg-blue-50 shadow-sm' 
                          : 'border-gray-200 hover:border-blue-300 bg-white'
                      }`}
                      onClick={() => handleDetailChange('disease', prediction.disease)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className={`h-3 w-3 rounded-full ${
                            userDetails.disease === prediction.disease ? 'bg-blue-500' : 'bg-gray-300'
                          }`}></div>
                          <span className="font-medium text-gray-900">{prediction.disease}</span>
                        </div>
                        <div className="flex items-center">
                          <Progress 
                            value={prediction.confidence * 100} 
                            className="h-2 w-24 mr-3" 
                            indicatorcolor={
                              prediction.confidence > 0.7 ? 'bg-green-500' : 
                              prediction.confidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                            }
                          />
                          <Badge 
                            variant={
                              prediction.confidence > 0.7 ? 'default' : 
                              prediction.confidence > 0.4 ? 'secondary' : 'destructive'
                            }
                            className="px-2 py-0.5"
                          >
                            {(prediction.confidence * 100).toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}