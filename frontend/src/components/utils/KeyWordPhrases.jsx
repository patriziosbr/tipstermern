import React, { useEffect, useState } from 'react';
import { retext } from 'retext';
import pos from 'retext-pos';
import keywords from 'retext-keywords';
import { toString } from 'nlcst-to-string';
import { FaRegClone } from "react-icons/fa";
import { toast } from 'react-toastify'


const KeyWordPhrases = ({ recognizedText }) => {
    const [keyWordAndPhrasesList, setKeyWordAndPhrasesList] = useState([]);

    const processText = async (text) => {
        try {
            const file = await retext()
                .use(pos) // Part-of-speech tagging
                .use(keywords) // Keyword and key-phrase extraction
                .process(text);

            const extractedKeywords = file.data.keywords.map((keyword) =>
                toString(keyword.matches[0].node)
            );

            const extractedKeyPhrases = file.data.keyphrases.map((phrase) =>
                phrase.matches[0].nodes.map((node) => toString(node)).join('')
            );

            setKeyWordAndPhrasesList([...extractedKeywords, ...extractedKeyPhrases]);
        } catch (err) {
            console.error('Error processing text:', err);
        }
    };

    const copy = (keyword) => {
        navigator.clipboard.writeText(keyword).then(() => {
            toast.info(`Copied to clipboard: ${keyword}`);
        }).catch(err => {
            toast.error('Failed to copy text: ', err);
        });
    }

    useEffect(() => {
        if (recognizedText) {
            processText(recognizedText);
        }
    }, [recognizedText]);

    return (
        <>
        <div className="d-none d-md-block mt-3">
            {keyWordAndPhrasesList.length > 0 && <h5>Keywords & Phrases</h5>}
            <ul className="keywords">
                {keyWordAndPhrasesList.map((keyword, index) => (
                    <li key={index}>{keyword} <FaRegClone onClick={()=>copy(keyword)}/></li>
                ))}
            </ul>
        </div>
        </>
    );
};

export default KeyWordPhrases;
