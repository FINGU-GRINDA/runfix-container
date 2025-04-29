// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { createHanaClient } from './client-sdk/client'
import { env } from '../src/config'

const client = createHanaClient({baseUrl:"http://localhost:8000"})


describe('alibaba', () => {
    it('return a good translation', async () => {
        const {data, error } =  await client.POST("/api/translations/stateless-ai-translate",{
            body:{
                path:"body > div > div",
                sourceLanguage:"ko",
                targetLanguage:"en",
                sourceText:"안녕하세요",
                context:"",
                model:"qwen-plus-latest"
            },
            params:{
                header:{
                    "api-key":env.TEST_API_KEY!
                }
            },
        })
        expect(data?.translatedText).toBe("Hello")
    })

    it("return a good translation with context", async () => {
        const {data, error } =  await client.POST("/api/translations/stateless-ai-translate",{
            body:{
                path:"body > div > div",
                sourceLanguage:"ko",
                targetLanguage:"en",
                sourceText:"1",
                context:"안녕하세요 1",
                model:"qwen-plus-latest"
            },
            params:{
                header:{
                    "api-key":env.TEST_API_KEY!
                }
            },
        })
        expect(data?.translatedText).toBe("1")
    })

    // handle concurrency
    it ("handle 10 concurrent translations",async ()=>{
        const promises = []
        for (let i=0; i< 10;i++){

            promises.push(client.POST("/api/translations/stateless-ai-translate",{
                body:{
                    path:"body > div > div",
                    sourceLanguage:"ko",
                    targetLanguage:"en",
                    sourceText:"1",
                    context:"안녕하세요 1",
                    model:"qwen-plus-latest"
                },
                params:{
                    header:{
                        "api-key":env.TEST_API_KEY!
                    }
                },

            }))
        }

        const responses = await Promise.all(promises)

        // check response
        let correctCount = 0
        for (const response of responses){
            if (response.data?.translatedText === "1") {
                correctCount++
            }
        }
        expect(correctCount).toBe(10)
    })

    it ("consistency in 50 translations",async ()=>{
        for (let i=0; i< 50;i++){

            const {data}= await client.POST("/api/translations/stateless-ai-translate",{
                body:{
                    path:"body > div > div",
                    sourceLanguage:"ko",
                    targetLanguage:"en",
                    sourceText:"1",
                    context:"안녕하세요 1",
                    model:"qwen-plus-latest"
                },
                params:{
                    header:{
                        "api-key":env.TEST_API_KEY!
                    }
                },
            })

            expect(data?.translatedText).toBe("1")
        }
    })
})



// describe('openrouter', () => {
//     it('return a good translation', async () => {
//         const {data, error } =  await client.POST("/api/translations/stateless-ai-translate",{
//             body:{
//                 path:"body > div > div",
//                 sourceLanguage:"ko",
//                 targetLanguage:"en",
//                 sourceText:"안녕하세요",
//                 context:"",
//                 model:"qwen/qwen3-14b"
//             },
//             params:{
//                 header:{
//                     "api-key":env.TEST_API_KEY!
//                 }
//             },
//         })
//         expect(data?.translatedText).toBe("Hello")
//     })

//     it("return a good translation with context", async () => {
//         const {data, error } =  await client.POST("/api/translations/stateless-ai-translate",{
//             body:{
//                 path:"body > div > div",
//                 sourceLanguage:"ko",
//                 targetLanguage:"en",
//                 sourceText:"1",
//                 context:"안녕하세요 1",
//                 model:"qwen/qwen3-14b"
//             },
//             params:{
//                 header:{
//                     "api-key":env.TEST_API_KEY!
//                 }
//             },
//         })
//         expect(data?.translatedText).toBe("1")
//     })

//     // handle concurrency
//     it ("handle 10 concurrent translations",async ()=>{
//         const promises = []
//         for (let i=0; i< 10;i++){

//             promises.push(client.POST("/api/translations/stateless-ai-translate",{
//                 body:{
//                     path:"body > div > div",
//                     sourceLanguage:"ko",
//                     targetLanguage:"en",
//                     sourceText:"1",
//                     context:"안녕하세요 1",
//                     model:"qwen/qwen3-14b"
//                 },
//                 params:{
//                     header:{
//                         "api-key":env.TEST_API_KEY!
//                     }
//                 },

//             }))
//         }

//         const responses = await Promise.all(promises)

//         // check response
//         let correctCount = 0
//         for (const response of responses){
//             if (response.data?.translatedText === "1") {
//                 correctCount++
//             }
//         }
//         expect(correctCount).toBe(10)
//     })

//     it ("consistency in 50 translations",async ()=>{
//         for (let i=0; i< 50;i++){

//             const {data}= await client.POST("/api/translations/stateless-ai-translate",{
//                 body:{
//                     path:"body > div > div",
//                     sourceLanguage:"ko",
//                     targetLanguage:"en",
//                     sourceText:"1",
//                     context:"안녕하세요 1",
//                     model:"qwen/qwen3-14b"
//                 },
//                 params:{
//                     header:{
//                         "api-key":env.TEST_API_KEY!
//                     }
//                 },
//             })

//             expect(data?.translatedText).toBe("1")
//         }
//     })

// })


// describe('openai', () => {
//     it('return a good translation', async () => {
//         const {data, error } =  await client.POST("/api/translations/stateless-ai-translate",{
//             body:{
//                 path:"body > div > div",
//                 sourceLanguage:"ko",
//                 targetLanguage:"en",
//                 sourceText:"안녕하세요",
//                 context:"",
//                 model:"gpt-4.1"
//             },
//             params:{
//                 header:{
//                     "api-key":env.TEST_API_KEY!
//                 }
//             },
//         })
//         expect(data?.translatedText).toBe("Hello")
//     })

//     it("return a good translation with context", async () => {
//         const {data, error } =  await client.POST("/api/translations/stateless-ai-translate",{
//             body:{
//                 path:"body > div > div",
//                 sourceLanguage:"ko",
//                 targetLanguage:"en",
//                 sourceText:"1",
//                 context:"안녕하세요 1",
//                 model:"gpt-4.1"
//             },
//             params:{
//                 header:{
//                     "api-key":env.TEST_API_KEY!
//                 }
//             },
//         })
//         expect(data?.translatedText).toBe("1")
//     })

//     // handle concurrency
//     it ("handle 10 concurrent translations",async ()=>{
//         const promises = []
//         for (let i=0; i< 10;i++){

//             promises.push(client.POST("/api/translations/stateless-ai-translate",{
//                 body:{
//                     path:"body > div > div",
//                     sourceLanguage:"ko",
//                     targetLanguage:"en",
//                     sourceText:"1",
//                     context:"안녕하세요 1",
//                     model:"gpt-4.1"
//                 },
//                 params:{
//                     header:{
//                         "api-key":env.TEST_API_KEY!
//                     }
//                 },

//             }))
//         }

//         const responses = await Promise.all(promises)

//         // check response
//         let correctCount = 0
//         for (const response of responses){
//             if (response.data?.translatedText === "1") {
//                 correctCount++
//             }
//         }
//         expect(correctCount).toBe(10)
//     })

//     it ("consistency in 50 translations",async ()=>{
//         for (let i=0; i< 50;i++){

//             const {data}= await client.POST("/api/translations/stateless-ai-translate",{
//                 body:{
//                     path:"body > div > div",
//                     sourceLanguage:"ko",
//                     targetLanguage:"en",
//                     sourceText:"1",
//                     context:"안녕하세요 1",
//                     model:"gpt-4.1"
//                 },
//                 params:{
//                     header:{
//                         "api-key":env.TEST_API_KEY!
//                     }
//                 },
//             })

//             expect(data?.translatedText).toBe("1")
//         }
//     })

// })