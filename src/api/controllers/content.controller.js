import {
  summarizeContent,
  explainContent,
  rewriteContent,
  formAssist
} from "../../core/services/content.service.js";

export const summarize = async (req, res, next) => {
  try {
    const result = await summarizeContent(req.body || {});
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

export const explain = async (req, res, next) => {
  try {
    const result = await explainContent(req.body || {});
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

export const rewrite = async (req, res, next) => {
  try {
    const result = await rewriteContent(req.body || {});
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

export const assistForm = async (req, res, next) => {
  try {
    const result = await formAssist(req.body || {});
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};
